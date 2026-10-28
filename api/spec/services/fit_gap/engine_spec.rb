# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FitGap::Engine do
  let(:assessment) { create(:assessment) }
  let(:session_record) { create(:session, assessment: assessment) }
  let(:portfolio) { create(:portfolio, session: session_record) }
  let(:vacancy) { create(:vacancy) }

  let(:mock_gemini_client) do
    instance_double(Gemini::HttpClient, generate_content: {
      'culture_narrative' => 'Strong culture alignment.',
      'overall_narrative' => 'Strong candidate profile.'
    })
  end

  subject(:engine) do
    described_class.new(portfolio: portfolio, vacancy: vacancy, gemini_client: mock_gemini_client)
  end

  describe '#call' do
    context 'when candidate level matches expected level' do
      before do
        create(:vacancy_skill, vacancy: vacancy, skill_label: 'React', expected_level: 3)
        create(:portfolio_skill, portfolio: portfolio, skill_label: 'React', ai_level: 3)
      end

      it 'generates a fit/gap report with match result and delta 0' do
        report = engine.call

        expect(report).to be_persisted
        comparison = report.skill_comparisons.find { |c| c['skill_label'] == 'React' }
        expect(comparison['result']).to eq('match')
        expect(comparison['delta']).to eq(0)
        expect(comparison['candidate_level']).to eq(3)
        expect(comparison['expected_level']).to eq(3)
        expect(comparison['required_level']).to eq(3)
      end
    end

    context 'when candidate exceeds expected level' do
      before do
        create(:vacancy_skill, vacancy: vacancy, skill_label: 'TypeScript', expected_level: 2)
        create(:portfolio_skill, portfolio: portfolio, skill_label: 'TypeScript', ai_level: 4)
      end

      it 'generates a report with exceed result and positive delta' do
        report = engine.call

        comparison = report.skill_comparisons.find { |c| c['skill_label'] == 'TypeScript' }
        expect(comparison['result']).to eq('exceed')
        expect(comparison['delta']).to eq(2)
      end
    end

    context 'when candidate has a gap against expected level' do
      before do
        create(:vacancy_skill, vacancy: vacancy, skill_label: 'Ruby', expected_level: 4)
        create(:portfolio_skill, portfolio: portfolio, skill_label: 'Ruby', ai_level: 2)
      end

      it 'generates a report with gap result and negative delta' do
        report = engine.call

        comparison = report.skill_comparisons.find { |c| c['skill_label'] == 'Ruby' }
        expect(comparison['result']).to eq('gap')
        expect(comparison['delta']).to eq(-2)
      end
    end

    context 'when a vacancy skill is missing/unassessed' do
      before do
        create(:vacancy_skill, vacancy: vacancy, skill_label: 'Docker', expected_level: 3)
      end

      it 'marks result as not_assessed without throwing nil arithmetic errors' do
        report = engine.call

        expect(report).to be_persisted
        comparison = report.skill_comparisons.find { |c| c['skill_label'] == 'Docker' }
        expect(comparison['result']).to eq('not_assessed')
        expect(comparison['candidate_level']).to be_nil
        expect(comparison['delta']).to be_nil
      end
    end

    context 'when an assessor override is applied' do
      let!(:skill) { create(:portfolio_skill, portfolio: portfolio, skill_label: 'System Design', ai_level: 2) }
      let!(:override) do
        create(:assessor_override, portfolio_skill: skill, ai_level: 2, override_level: 4, overridden_by: 1)
      end

      before do
        create(:vacancy_skill, vacancy: vacancy, skill_label: 'System Design', expected_level: 3)
      end

      it 'uses the override level for calculation and marks is_override true' do
        report = engine.call

        comparison = report.skill_comparisons.find { |c| c['skill_label'] == 'System Design' }
        expect(comparison['candidate_level']).to eq(4)
        expect(comparison['result']).to eq('exceed')
        expect(comparison['delta']).to eq(1)
        expect(comparison['is_override']).to be true
      end
    end

    context 'when Gemini client raises an error' do
      let(:failing_gemini_client) do
        instance_double(Gemini::HttpClient).tap do |client|
          allow(client).to receive(:generate_content).and_raise(Gemini::HttpClient::ApiError.new('Rate limit'))
        end
      end

      subject(:engine_with_failure) do
        described_class.new(portfolio: portfolio, vacancy: vacancy, gemini_client: failing_gemini_client)
      end

      before do
        create(:vacancy_skill, vacancy: vacancy, skill_label: 'Docker', expected_level: 3)
        create(:vacancy_skill, vacancy: vacancy, skill_label: 'React', expected_level: 3)
        create(:portfolio_skill, portfolio: portfolio, skill_label: 'React', ai_level: 3)
      end

      it 'gracefully falls back to rule-based narrative mentioning unassessed skills' do
        report = engine_with_failure.call

        expect(report.culture_narrative).to be_nil
        expect(report.overall_narrative).to include('Candidate shows 1 skill match')
        expect(report.overall_narrative).to include('1 skill not assessed')
      end
    end
  end
end

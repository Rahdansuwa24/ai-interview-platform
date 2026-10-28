# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Portfolios::Generator do
  let(:assessment) { create(:assessment) }
  let(:session_record) { create(:session, assessment: assessment) }

  let(:gemini_response) do
    {
      'configured_skills' => [
        {
          'skill_id' => 'sk-react',
          'skill_label' => 'React',
          'level' => 3,
          'confidence' => 'high',
          'evidence' => ['Explains reconciliation and virtual DOM clearly.'],
          'competency_summary' => 'Solid React proficiency.'
        },
        {
          'skill_id' => 'sk-docker',
          'skill_label' => 'Docker',
          'level' => nil,
          'confidence' => 'unassessed',
          'evidence' => [],
          'competency_summary' => 'Not assessed during this session.'
        }
      ],
      'discovered_skills' => [
        {
          'skill_label' => 'GraphQL',
          'level' => 2,
          'confidence' => 'medium',
          'evidence' => ['Built schema resolvers for personal project.'],
          'competency_summary' => 'Functional understanding of GraphQL schemas.'
        }
      ]
    }
  end

  let(:mock_gemini_client) do
    instance_double(Gemini::HttpClient, generate_content: gemini_response)
  end

  subject(:generator) do
    described_class.new(session: session_record, gemini_client: mock_gemini_client)
  end

  describe '#call' do
    it 'creates a portfolio and populates only assessed skills' do
      portfolio = generator.call

      expect(portfolio).to be_complete
      expect(portfolio.portfolio_skills.count).to eq(2) # React and GraphQL, Docker omitted

      react_skill = portfolio.portfolio_skills.find_by(skill_label: 'React')
      expect(react_skill).to be_present
      expect(react_skill.ai_level).to eq(3)
      expect(react_skill.ai_confidence).to eq('high')
      expect(react_skill.is_discovered).to be false

      graphql_skill = portfolio.portfolio_skills.find_by(skill_label: 'GraphQL')
      expect(graphql_skill).to be_present
      expect(graphql_skill.ai_level).to eq(2)
      expect(graphql_skill.is_discovered).to be true

      # Verifies Docker was NOT falsely saved as L1
      docker_skill = portfolio.portfolio_skills.find_by(skill_label: 'Docker')
      expect(docker_skill).to be_nil
    end
  end
end

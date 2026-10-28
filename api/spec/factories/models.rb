# frozen_string_literal: true

FactoryBot.define do
  factory :organization do
    sequence(:name) { |n| "Tenant #{n}" }
    sequence(:scheme) { |n| "tenant-#{n}" }
    sequence(:identifier) { |n| "id-#{n}" }
    sequence(:host) { |n| "tenant#{n}.example.com" }
  end

  factory :assessment do
    tenant_id { 1 }
    created_by { 1 }
    name { 'Frontend Engineer Assessment' }
    time_limit_min { 45 }
    language { 'en' }
  end

  factory :session do
    tenant_id { 1 }
    assessment
    sequence(:invite_token) { |n| "token_#{SecureRandom.hex(16)}_#{n}" }
    status { 'ended' }
  end

  factory :portfolio do
    session
    generation_status { 'complete' }
    generated_at { Time.current }
  end

  factory :portfolio_skill do
    portfolio
    skill_label { 'React' }
    ai_level { 3 }
    ai_confidence { 'high' }
    competency_summary { 'Demonstrates strong understanding of React hooks and component lifecycle.' }
    evidence { ['Uses useEffect cleanly with correct dependency array'] }
  end

  factory :vacancy do
    tenant_id { 1 }
    created_by { 1 }
    role_title { 'Senior Frontend Engineer' }
    culture_dimensions { 'Fast-paced, collaborative, autonomy' }
    competency_expectations { 'Deep frontend architecture expertise' }
  end

  factory :vacancy_skill do
    vacancy
    skill_label { 'React' }
    expected_level { 3 }
  end

  factory :assessor_override do
    portfolio_skill
    ai_level { 2 }
    override_level { 4 }
    overridden_by { 1 }
    assessor_notes { 'Candidate demonstrated advanced real-world mastery during deep-dive.' }
  end
end


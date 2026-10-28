import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillPortfolioCard from "../SkillPortfolioCard";
import type { PortfolioSkill } from "@/types";

describe("SkillPortfolioCard Component", () => {
  it("renders unassessed skill without defaulting to L1 Foundational", () => {
    const unassessedSkill: PortfolioSkill = {
      id: 1,
      skill_id: 101,
      skill_label: "Docker & Containerization",
      is_discovered: false,
      ai_level: "unassessed",
      ai_confidence: "unassessed",
      evidence: [],
      competency_summary: "Not assessed during this session.",
    };

    render(
      <SkillPortfolioCard
        skill={unassessedSkill}
        onOverrideSaved={vi.fn()}
      />
    );

    // Should render unassessed indicators
    expect(screen.getByText("Docker & Containerization")).toBeInTheDocument();
    expect(screen.getByText("Skill ini belum sempat diujikan pada sesi wawancara ini.")).toBeInTheDocument();
    expect(screen.getByText("Confidence: Not Assessed")).toBeInTheDocument();

    // Must NOT fabricate L1 Foundational
    expect(screen.queryByText("Foundational")).not.toBeInTheDocument();
    expect(screen.queryByText("L1")).not.toBeInTheDocument();
  });

  it("renders evaluated skill with expected level badge and evidence", () => {
    const assessedSkill: PortfolioSkill = {
      id: 2,
      skill_id: 102,
      skill_label: "Ruby on Rails",
      is_discovered: false,
      ai_level: "L3",
      ai_confidence: "high",
      evidence: ["Candidate explained ActiveRecord associations and scopes."],
      competency_summary: "Solid intermediate Rails knowledge.",
    };

    render(
      <SkillPortfolioCard
        skill={assessedSkill}
        onOverrideSaved={vi.fn()}
      />
    );

    expect(screen.getByText("Ruby on Rails")).toBeInTheDocument();
    expect(screen.getByText("L3")).toBeInTheDocument();
    expect(screen.getByText("Proficient")).toBeInTheDocument();
    expect(screen.getByText("Confidence: HIGH")).toBeInTheDocument();
    expect(screen.getByText(/ActiveRecord associations/i)).toBeInTheDocument();
  });
});


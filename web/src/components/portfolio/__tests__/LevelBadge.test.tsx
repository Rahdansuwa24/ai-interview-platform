import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LevelBadge from "../LevelBadge";

describe("LevelBadge Component", () => {
    it("renders level label and description for L3", () => {
        render(<LevelBadge level={3} />);
        expect(screen.getByText("L3")).toBeInTheDocument();
        expect(screen.getByText("Proficient")).toBeInTheDocument();
    });

    it("renders compact size without description when size is sm", () => {
        render(<LevelBadge level={2} size="sm" />);
        expect(screen.getByText("L2")).toBeInTheDocument();
        expect(screen.queryByText("Functional")).not.toBeInTheDocument();
    });

    it("renders unassessed state cleanly when level is 0 or null", () => {
        const { rerender } = render(<LevelBadge level={0} />);
        expect(screen.getByText("—")).toBeInTheDocument();
        expect(screen.getByText("Not Assessed")).toBeInTheDocument();

        rerender(<LevelBadge level={null} size="sm" />);
        expect(screen.getByText("—")).toBeInTheDocument();
        expect(screen.queryByText("Not Assessed")).not.toBeInTheDocument();
    });
});

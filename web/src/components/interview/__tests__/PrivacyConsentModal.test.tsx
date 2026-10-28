import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PrivacyConsentModal from "../PrivacyConsentModal";

describe("PrivacyConsentModal Component (UU PDP Compliance)", () => {
  it("renders UU PDP modal with regulatory descriptions", () => {
    render(
      <PrivacyConsentModal
        open={true}
        onConsent={vi.fn()}
        roleTitle="Senior Software Engineer"
      />
    );

    expect(screen.getByText(/Persetujuan Pemrosesan Data Pribadi & Biometrik Suara/i)).toBeInTheDocument();
    expect(screen.getAllByText(/UU PDP/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument();
  });

  it("keeps submit button disabled until both biometric and transcript consents are checked", () => {
    const handleConsent = vi.fn();
    render(
      <PrivacyConsentModal
        open={true}
        onConsent={handleConsent}
        roleTitle="Senior Software Engineer"
      />
    );

    const submitBtn = screen.getByTestId("consent-submit-button");
    const biometricCheckbox = screen.getByTestId("consent-biometric-checkbox");
    const transcriptCheckbox = screen.getByTestId("consent-transcript-checkbox");

    // Initially disabled
    expect(submitBtn).toBeDisabled();

    // Check only biometric
    fireEvent.click(biometricCheckbox);
    expect(submitBtn).toBeDisabled();

    // Check transcript as well
    fireEvent.click(transcriptCheckbox);
    expect(submitBtn).toBeEnabled();

    // Click submit
    fireEvent.click(submitBtn);
    expect(handleConsent).toHaveBeenCalledTimes(1);
  });
});

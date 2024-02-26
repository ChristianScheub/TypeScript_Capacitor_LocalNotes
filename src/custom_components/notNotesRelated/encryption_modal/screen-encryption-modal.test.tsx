import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import EncryptionKeyModalView from "./screen-encryption-modal";
import "@testing-library/jest-dom/extend-expect";

describe("EncryptionKeyModalView", () => {
  const mockHandleKeySubmit = jest.fn();
  const mockActivateFingerprint = jest.fn();
  const mockNavigateToPrivacy = jest.fn();
  const mockInputRef = {
    current: document.createElement("input"),
  };

  it("renders correctly", () => {
    render(
      <EncryptionKeyModalView
        showFingerprintBtn={true}
        showFingerprintHint={false}
        handleKeySubmit={mockHandleKeySubmit}
        activateFingerprint={mockActivateFingerprint}
        navigateToPrivacy={mockNavigateToPrivacy}
        inputRef={mockInputRef}
      />
    );
    expect( screen.getByTestId("password-inputBtn")).toBeInTheDocument();
  });

  it("calls handleKeySubmit on form submit", () => {
    const { getByText } = render(
      <EncryptionKeyModalView
        handleKeySubmit={mockHandleKeySubmit}
        showFingerprintHint={false}
        activateFingerprint={mockActivateFingerprint}
        showFingerprintBtn={true}
        navigateToPrivacy={mockNavigateToPrivacy}
        inputRef={mockInputRef}
      />
    );
  });

  it("calls activateFingerprint on button click", () => {
    render(
      <EncryptionKeyModalView
        handleKeySubmit={mockHandleKeySubmit}
        showFingerprintHint={false}
        activateFingerprint={mockActivateFingerprint}
        showFingerprintBtn={true}
        navigateToPrivacy={mockNavigateToPrivacy}
        inputRef={mockInputRef}
      />
    );
    const floatingBtns = screen.queryAllByTestId("floating-btn");
    const fingerprintBtn = floatingBtns[0];
    fireEvent.click(fingerprintBtn);
    expect(mockActivateFingerprint).toHaveBeenCalled();
  });

  it("open datenschutz correct on button click", () => {
    render(
      <EncryptionKeyModalView
        handleKeySubmit={mockHandleKeySubmit}
        showFingerprintHint={false}
        activateFingerprint={mockActivateFingerprint}
        showFingerprintBtn={true}
        navigateToPrivacy={mockNavigateToPrivacy}
        inputRef={mockInputRef}
      />
    );
    const privacyButtons = screen.queryAllByTestId("floating-btn");
    const privacyButton1 = privacyButtons[1];
    fireEvent.click(privacyButton1);
    expect(mockNavigateToPrivacy).toHaveBeenCalled();
  });
});

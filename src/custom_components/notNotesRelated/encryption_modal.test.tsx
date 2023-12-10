import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EncryptionKeyModal from "./encryption_modal";
import { BrowserRouter as Router } from "react-router-dom";


jest.mock('capacitor-native-biometric', () => ({
  NativeBiometric: {
    isAvailable: jest.fn().mockResolvedValue({ isAvailable: true }),
    verifyIdentity: jest.fn().mockResolvedValue(true),
    getCredentials: jest.fn().mockResolvedValue({ password: 'encryptedPassword' }),
    setCredentials: jest.fn().mockResolvedValue(undefined)
  },
}));

jest.mock('@capacitor/device', () => ({
  Device: {
    getId: jest.fn().mockResolvedValue({ identifier: 'uniqueIdentifier' }),
  },
}));

jest.mock('crypto-js', () => ({
  SHA256: jest.fn().mockReturnValue({ toString: () => 'hashedIdentifier' }),
  TripleDES: {
    encrypt: jest.fn().mockReturnValue({ toString: () => 'encryptedData' }),
    decrypt: jest.fn().mockReturnValue({ toString: () => 'decryptedData' })
  },
}));


describe("<EncryptionKeyModal />", () => {
  jest.mock('capacitor-native-biometric', () => ({
    NativeBiometric: {
      isAvailable: jest.fn().mockResolvedValue({ isAvailable: true }),
      verifyIdentity: jest.fn().mockResolvedValue(true),
      getCredentials: jest.fn().mockResolvedValue({ password: 'encryptedPassword' }),
      setCredentials: jest.fn().mockResolvedValue(undefined)
    },
  }));

  it("renders without crashing", () => {
    render(
      <Router>
        <EncryptionKeyModal onSubmit={() => {}} />
      </Router>
    );
    expect(screen.getByText("Passwort eingeben")).toBeInTheDocument();
  });

  it("submits the form with the entered encryption key", () => {
    const onSubmitMock = jest.fn();
    render(
      <Router>
        <EncryptionKeyModal onSubmit={onSubmitMock} />
      </Router>
    );
    const input = screen.getByTestId("password-input");
    fireEvent.change(input, { target: { value: "test123" } });
    fireEvent.click(screen.getByText("Weiter"));
    expect(onSubmitMock).toHaveBeenCalledWith("test123");
  });

  it('navigates to privacy policy page on privacy button click', () => {
    render(
      <Router>
        <EncryptionKeyModal onSubmit={() => {}} />
      </Router>
    );
    const privacyButtons = screen.queryAllByTestId("floating-btn");
    const privacyButton1 = privacyButtons[1];
    fireEvent.click(privacyButton1);

    expect(window.location.pathname).toBe("/datenschutz");

  });

  
 

  
  
});

import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EncryptionKeyModalContainer from "./container-encryption-modal";
import { BrowserRouter as Router } from "react-router-dom";
import * as fingerprintLogic from "../fingerprintLogic";

jest.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: jest.fn().mockResolvedValue({ isAvailable: true }),
    verifyIdentity: jest.fn().mockResolvedValue(true),
    getCredentials: jest
      .fn()
      .mockResolvedValue({ password: "encryptedPassword" }),
    setCredentials: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@capacitor/device", () => ({
  Device: {
    getId: jest.fn().mockResolvedValue({ identifier: "uniqueIdentifier" }),
  },
}));

jest.mock("crypto-js", () => ({
  SHA256: jest.fn().mockReturnValue({ toString: () => "hashedIdentifier" }),
  TripleDES: {
    encrypt: jest.fn().mockReturnValue({ toString: () => "encryptedData" }),
    decrypt: jest.fn().mockReturnValue({ toString: () => "decryptedData" }),
  },
}));

jest.mock("../fingerprintLogic", () => ({
  availableBiometric: jest.fn(),
  getPasswordFromFingerprint: jest.fn(),
  storePasswordFromFingerprint: jest.fn(),
}));

beforeEach(() => {
  (fingerprintLogic.availableBiometric as jest.Mock).mockResolvedValue(true);
});

describe("<EncryptionKeyModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});

    (
      fingerprintLogic.getPasswordFromFingerprint as jest.Mock
    ).mockImplementation((_, onSuccess, __, ___) => {
      onSuccess("mocked password");
    });
    (
      fingerprintLogic.storePasswordFromFingerprint as jest.Mock
    ).mockImplementation((_, onSuccess, __) => {
      onSuccess();
    });
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
    });
  });

  it("submits the form with the entered encryption key", async () => {
    const onSubmitMock = jest.fn();
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={onSubmitMock} />
        </Router>
      );
    });
    await waitFor(() => {
      const input = screen.getByTestId("password-input");
      fireEvent.change(input, { target: { value: "test123" } });
      fireEvent.click(screen.getByTestId("password-inputBtn"));
      expect(onSubmitMock).toHaveBeenCalledWith("test123");
    });
  });

  it("navigates to privacy policy page on privacy button click", async () => {
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });
    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      const privacyButton1 = privacyButtons[1];
      act(() => {
        fireEvent.click(privacyButton1);
      });

      expect(window.location.pathname).toBe("/datenschutz");
    });
  });

  it("handles fingerprint authentication success", async () => {
    const onSubmitMock = jest.fn();
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={onSubmitMock} />
        </Router>
      );
    });
    const privacyButtons = screen.queryAllByTestId("floating-btn");
    fireEvent.click(privacyButtons[0]);

    await waitFor(() => {
      expect(fingerprintLogic.getPasswordFromFingerprint).toHaveBeenCalled();
    });
  });

  it("handles error in storePasswordFromFingerprint", async () => {
    const errorMessage = "Store error";
    (
      fingerprintLogic.storePasswordFromFingerprint as jest.Mock
    ).mockImplementation((_, __, onError) => {
      onError(errorMessage);
    });

    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });

    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      fireEvent.click(privacyButtons[0]);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  it("handles successful password retrieval", async () => {
    const mockPassword = "retrievedPassword";
    (
      fingerprintLogic.getPasswordFromFingerprint as jest.Mock
    ).mockImplementation((_, __, onSuccess) => {
      onSuccess(mockPassword);
    });

    const onSubmitMock = jest.fn();
    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={onSubmitMock} />
        </Router>
      );
    });

    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      fireEvent.click(privacyButtons[0]);
      expect(onSubmitMock).toHaveBeenCalledWith(mockPassword);
    });
  });

  it("handles error in getPasswordFromFingerprint", async () => {
    const errorMessage = "Retrieval error";
    (
      fingerprintLogic.getPasswordFromFingerprint as jest.Mock
    ).mockImplementation((_, __, ___, onError) => {
      onError(errorMessage);
    });

    await act(async () => {
      render(
        <Router>
          <EncryptionKeyModalContainer onSubmit={() => {}} />
        </Router>
      );
    });

    await waitFor(() => {
      const privacyButtons = screen.queryAllByTestId("floating-btn");
      fireEvent.click(privacyButtons[0]);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });
});

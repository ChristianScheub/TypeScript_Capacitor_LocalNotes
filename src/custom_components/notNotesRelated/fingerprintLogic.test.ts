import { NativeBiometric } from "capacitor-native-biometric";
import CryptoJS from "crypto-js";
import { Device } from "@capacitor/device";
import {
  getPasswordFromFingerprint,
  storePasswordFromFingerprint,
} from "./fingerprintLogic"; // adjust the import path

jest.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: jest.fn(),
    verifyIdentity: jest.fn(),
    getCredentials: jest.fn(),
    setCredentials: jest.fn(),
  },
}));

jest.mock("crypto-js", () => ({
  SHA256: jest.fn(),
  TripleDES: {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  },
  enc: {
    Utf8: {
      stringify: jest.fn(),
    },
  },
}));

jest.mock("@capacitor/device", () => ({
  Device: {
    getId: jest.fn(),
  },
}));

// Additional mock setup for CryptoJS if necessary
describe("getPasswordFromFingerprint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully retrieves password", async () => {
    // Mock the behavior of external dependencies for the success scenario
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({
      isAvailable: true,
    });
    (NativeBiometric.verifyIdentity as jest.Mock).mockResolvedValue(true);
    (NativeBiometric.getCredentials as jest.Mock).mockResolvedValue({
      password: "encryptedPassword",
    });
    (Device.getId as jest.Mock).mockResolvedValue({
      identifier: "deviceIdentifier",
    });
    (CryptoJS.SHA256 as jest.Mock).mockReturnValue("hashedIdentifier");
    (CryptoJS.TripleDES.decrypt as jest.Mock).mockReturnValue({
      toString: jest.fn(() => "decryptedPassword"),
    });

    const onPasswordRetrieved = jest.fn();
    const onError = jest.fn();

    await getPasswordFromFingerprint(
      "www.LocalNotes.com",
      jest.fn(),
      onPasswordRetrieved,
      onError
    );

    expect(onPasswordRetrieved).toHaveBeenCalledWith("decryptedPassword");
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles the case where biometric authentication is not available', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: false });
    const onError = jest.fn();
    await getPasswordFromFingerprint('www.LocalNotes.com', jest.fn(), jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung nicht verfügbar.");
  });

  it('handles biometric authentication failure', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: true });
    (NativeBiometric.verifyIdentity as jest.Mock).mockRejectedValue(new Error());
    const onError = jest.fn();
    await getPasswordFromFingerprint('www.LocalNotes.com', jest.fn(), jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung fehlgeschlagen.");
  });

  it('handles empty password scenario', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: true });
    (NativeBiometric.verifyIdentity as jest.Mock).mockResolvedValue(true);
    (NativeBiometric.getCredentials as jest.Mock).mockResolvedValue({ password: '' });
    const onEmptyPassword = jest.fn();
    const onError = jest.fn();
    await getPasswordFromFingerprint('www.LocalNotes.com', onEmptyPassword, jest.fn(), onError);
    expect(onEmptyPassword).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith("Gespeichertes Passwort ist leer.");
  });

  it('handles general error during password retrieval', async () => {
    const onEmptyPassword = jest.fn();
    const onError = jest.fn();
  
    (NativeBiometric.getCredentials as jest.Mock).mockRejectedValue(new Error('General error'));
    await getPasswordFromFingerprint('testServer', onEmptyPassword, jest.fn(), onError);
  
    expect(onError).toHaveBeenCalledWith("Ein Fehler ist aufgetreten.");
    expect(onEmptyPassword).not.toHaveBeenCalled();
  });
});

describe("storePasswordFromFingerprint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully stores password", async () => {
    // Mock the behavior of external dependencies for the success scenario
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({
      isAvailable: true,
    });
    (Device.getId as jest.Mock).mockResolvedValue({
      identifier: "deviceIdentifier",
    });
    (CryptoJS.SHA256 as jest.Mock).mockReturnValue("hashedIdentifier");
    (CryptoJS.TripleDES.encrypt as jest.Mock).mockReturnValue({
      toString: jest.fn(() => "encryptedPassword"),
    });

    const onSuccess = jest.fn();
    const onError = jest.fn();

    await storePasswordFromFingerprint("testPassword", onSuccess, onError);

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles case where biometric authentication is not available', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: false });
    const onError = jest.fn();
    await storePasswordFromFingerprint('testPassword', jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung nicht verfügbar.");
  });

  it('handles case where no password is provided', async () => {
    const onError = jest.fn();
    await storePasswordFromFingerprint('', jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith("Bitte geben Sie das zu speichernde Passwort ein.");
  });

  it('handles error during password storing', async () => {
    const onError = jest.fn();
    (NativeBiometric.setCredentials as jest.Mock).mockRejectedValue(new Error('Test error'));
    await storePasswordFromFingerprint('testPassword', jest.fn(), onError);
    expect(onError).toHaveBeenCalledWith("Ein Fehler ist aufgetreten beim Speichern des Passworts.");
  });

});

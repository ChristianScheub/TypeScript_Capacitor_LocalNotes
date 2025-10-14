import { NativeBiometric } from "capacitor-native-biometric";
import CryptoJS from "crypto-js";
import { Device } from "@capacitor/device";
import {
  getPasswordFromFingerprint,
  storePasswordFromFingerprint,
} from "./fingerprintLogic";
import { getPBKDF2_Password } from '../handleNotes/encryptionEngine';

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

jest.mock('../handleNotes/encryptionEngine', () => ({
  getPBKDF2_Password: jest.fn().mockImplementation(password => password),
}));

const t = (key: string): string => {
  switch (key) {
    case 'fingerprint_empty':
      return 'Bitte geben Sie das zu speichernde Passwort erst ein und drücken sie dann diesen Button zum speichern.';
    case 'fingerprint_not_Avaible':
      return 'Biometrische Authentifizierung nicht verfügbar.';
    case 'fingerprint_error':
      return 'Ein Fehler ist aufgetreten. Bitte versuchen sie es erneut!';
    default:
      return '';
  }
};

describe("getPasswordFromFingerprint", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (getPBKDF2_Password as jest.Mock).mockImplementation(password => password);
  });

  it("successfully retrieves password", async () => {
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
      onError,
      t
    );

    expect(onPasswordRetrieved).toHaveBeenCalledWith("decryptedPassword");
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles the case where biometric authentication is not available', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: false });
    const onError = jest.fn();
    await getPasswordFromFingerprint('www.LocalNotes.com', jest.fn(), jest.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung nicht verfügbar.");
  });

  it('handles biometric authentication failure', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: true });
    (NativeBiometric.verifyIdentity as jest.Mock).mockRejectedValue(new Error());
    const onError = jest.fn();
    await getPasswordFromFingerprint('www.LocalNotes.com', jest.fn(), jest.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Ein Fehler ist aufgetreten. Bitte versuchen sie es erneut!");
  });

  it('handles empty password scenario', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: true });
    (NativeBiometric.verifyIdentity as jest.Mock).mockResolvedValue(true);
    (NativeBiometric.getCredentials as jest.Mock).mockResolvedValue({ password: '' });
    const onEmptyPassword = jest.fn();
    const onError = jest.fn();
    await getPasswordFromFingerprint('www.LocalNotes.com', onEmptyPassword, jest.fn(), onError,t);
    expect(onEmptyPassword).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith("Ein Fehler ist aufgetreten. Bitte versuchen sie es erneut!");
  });

  it('handles general error during password retrieval', async () => {
    const onEmptyPassword = jest.fn();
    const onError = jest.fn();
  
    (NativeBiometric.getCredentials as jest.Mock).mockRejectedValue(new Error('General error'));
    await getPasswordFromFingerprint('www.LocalNotes.com', onEmptyPassword, jest.fn(), onError,t);
  
    expect(onEmptyPassword).toHaveBeenCalled();
  });
});

describe("storePasswordFromFingerprint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully stores password", async () => {
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

    await storePasswordFromFingerprint("testPassword", onSuccess, onError,t);

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('handles case where biometric authentication is not available', async () => {
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: false });
    const onError = jest.fn();
    await storePasswordFromFingerprint('testPassword', jest.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Biometrische Authentifizierung nicht verfügbar.");
  });

  it('handles case where no password is provided', async () => {
    const onError = jest.fn();
    await storePasswordFromFingerprint('', jest.fn(), onError,t);
    expect(onError).toHaveBeenCalledWith("Bitte geben Sie das zu speichernde Passwort erst ein und drücken sie dann diesen Button zum speichern.");
  });

  it('handles error during password storing', async () => {
    const onError = jest.fn();
    // Ensure biometric is available so setCredentials() is actually called
    (NativeBiometric.isAvailable as jest.Mock).mockResolvedValue({ isAvailable: true });
    (NativeBiometric.setCredentials as jest.Mock).mockRejectedValue(new Error('Test error'));
    await storePasswordFromFingerprint('testPassword', jest.fn(), onError,t);
    // The implementation falls back to a generic error on setCredentials rejection
    expect(onError).toHaveBeenCalledWith("Ein Fehler ist aufgetreten. Bitte versuchen sie es erneut!");
  });

});

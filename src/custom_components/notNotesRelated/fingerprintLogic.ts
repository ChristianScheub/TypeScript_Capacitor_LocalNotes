import { NativeBiometric } from "capacitor-native-biometric";
import CryptoJS from "crypto-js";
import { Device } from "@capacitor/device";

const getDeviceIdHash = async (): Promise<string> => {
  const info = await Device.getId();
  if (!info) {
    throw new Error("Info-Komponente nicht verfügbar");
  }

  if (!info.identifier) {
    throw new Error("UUID nicht verfügbar");
  }

  return CryptoJS.SHA256(info.identifier).toString();
};

export const getPasswordFromFingerprint = async (
  server: string,
  onEmptyPassword: () => void,
  onPasswordRetrieved: (password: string) => void,
  onError: (errorMessage: string) => void
): Promise<void> => {
  try {
    const available = await NativeBiometric.isAvailable();

    if (!available.isAvailable) {
      onError("Biometrische Authentifizierung nicht verfügbar.");
      return;
    }

    const verified = await NativeBiometric.verifyIdentity({
      reason: "Bitte bestätige deine Identität",
      title: "Biometrische Authentifizierung",
    })
      .then(() => true)
      .catch(() => false);

    if (!verified) {
      onError("Biometrische Authentifizierung fehlgeschlagen.");
      return;
    }

    const credentials = await NativeBiometric.getCredentials({ server });

    if (credentials.password === "") {
      onError("Gespeichertes Passwort ist leer.");
      onEmptyPassword();
      return;
    }

    const hashedDeviceId = await getDeviceIdHash();
    const decryptedPassword = CryptoJS.TripleDES.decrypt(
      credentials.password,
      hashedDeviceId
    ).toString(CryptoJS.enc.Utf8);

    onPasswordRetrieved(decryptedPassword);
  } catch (e) {
    console.error("Fehler beim Abrufen des Passworts:", e);
    if (e instanceof Error && e.message === "No credentials found") {
      onEmptyPassword();
    } else {
      onError("Ein Fehler ist aufgetreten.");
    }
  }
};

export const storePasswordFromFingerprint = async (
  password: string,
  onSuccess: () => void,
  onError: (errorMessage: string) => void
): Promise<void> => {
  try {
    const available = await NativeBiometric.isAvailable();

    if (!available.isAvailable) {
      onError("Biometrische Authentifizierung nicht verfügbar.");
      return;
    }

    if (!password) {
      onError("Bitte geben Sie das zu speichernde Passwort ein.");
      return;
    }

    const hashedDeviceId = await getDeviceIdHash();
    await NativeBiometric.setCredentials({
      server: "www.LocalNotes.com",
      username: "user",
      password: CryptoJS.TripleDES.encrypt(password, hashedDeviceId).toString(),
    });

    onSuccess();
  } catch (e) {
    console.error("Fehler beim Speichern des Passworts:", e);
    onError("Ein Fehler ist aufgetreten beim Speichern des Passworts.");
  }
};

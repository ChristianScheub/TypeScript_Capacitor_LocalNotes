import { NativeBiometric } from "capacitor-native-biometric";
import CryptoJS from "crypto-js";
import { Device } from "@capacitor/device";
import { getPBKDF2_Password } from "../handleNotes/encryptionEngine";
import { useTranslation } from 'react-i18next';

const getDeviceIdHash = async (): Promise<string> => {
  const info = await Device.getId();
  return CryptoJS.SHA256(info.identifier+"LocalNotesSecure").toString();
};

export const getPasswordFromFingerprint = async (
  server: string,
  onEmptyPassword: () => void,
  onPasswordRetrieved: (password: string) => void,
  onError: (errorMessage: string) => void,
  t: (key: string) => string 
): Promise<void> => {

  try {
    const available = await NativeBiometric.isAvailable();

    if (!available.isAvailable) {
      onError(t('fingerprint_not_Avaible'));
      return;
    }

    const verified = await NativeBiometric.verifyIdentity({
      reason: "Bitte bestätige deine Identität",
      title: "Biometrische Authentifizierung",
    })
      .then(() => true)
      .catch(() => false);

    if (!verified) {
      onError(t('fingerprint_error'));
      return;
    }

    const credentials = await NativeBiometric.getCredentials({ server });

    if (credentials.password === "") {
      onError(t('fingerprint_error'));
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
    //console.log(e);
    if (e) {
      onEmptyPassword();
    } else {
      onError(t('fingerprint_error'));
    }
  }
};

export const storePasswordFromFingerprint = async (
  password: string,
  onSuccess: () => void,
  onError: (errorMessage: string) => void,
  t: (key: string) => string 
): Promise<void> => {

  try {
    const available = await NativeBiometric.isAvailable();

    if (!password|| password==="") {
      onError(t('fingerprint_empty'));
      return;
    }

    if (!available.isAvailable) {
      onError(t('fingerprint_not_Avaible'));
      return;
    }

    const hashedDeviceId = await getDeviceIdHash();
    await NativeBiometric.setCredentials({
      server: "www.LocalNotes.com",
      username: "user",
      password: CryptoJS.TripleDES.encrypt(getPBKDF2_Password(password), hashedDeviceId).toString(),
    });
    localStorage.setItem("setFingerprint", "yey");

    onSuccess();
  } catch (e) {
    onError(t('fingerprint_error'));
  }
};

export const availableBiometric = async (): Promise<Boolean> => {
  try {
    return ((await NativeBiometric.isAvailable()).isAvailable);
  } catch (error) {
    return false;
  }
}

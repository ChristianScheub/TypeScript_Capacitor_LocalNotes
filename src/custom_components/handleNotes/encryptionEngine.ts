import CryptoJS from "crypto-js";
import { Device } from "@capacitor/device";

const deriveKeyPBKDF2 = (
  password: string,
  salt: CryptoJS.lib.WordArray
): CryptoJS.lib.WordArray => {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  return key;
};

export const encryptAndStore = async (
  text: string,
  password: string,
  storageKey: string
): Promise<void> => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = deriveKeyPBKDF2(password, salt);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const encryptedDataPBKDF2 = `${encrypted.toString()}::${iv.toString()}::${salt.toString()}`;
  const encryptedData = CryptoJS.TripleDES.encrypt(
    encryptedDataPBKDF2,
    await getDeviceIdHash()
  ).toString();

  localStorage.setItem(storageKey, encryptedData);
};

export const decryptFromStorage = async (
  password: string,
  storageKey: string
): Promise<string> => {
  const encryptedData = localStorage.getItem(storageKey);

  if (!encryptedData) {
    return "";
  }

  const decryptedDateWithDeviceId = CryptoJS.TripleDES.decrypt(
    encryptedData,
    await getDeviceIdHash()
  ).toString(CryptoJS.enc.Utf8);

  const [encryptedText, iv, salt] = decryptedDateWithDeviceId.split("::");
  const key = deriveKeyPBKDF2(password, CryptoJS.enc.Hex.parse(salt));
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  return decrypted;
};

const getDeviceIdHash = async (): Promise<string> => {
  const info = await Device.getId();
  return CryptoJS.SHA256(info.identifier + "LocalNotesSecure").toString();
};

export const makeReadyForExport = async (
  encryptedData: string
): Promise<string> => {
  let decrypted = CryptoJS.AES.decrypt(
    encryptedData,
    await getDeviceIdHash()
  ).toString();
  return CryptoJS.AES.encrypt(decrypted, "LocalNotesSecureExport").toString();
};

export const makeReadyForImport = async (
  encryptedData: string
): Promise<string> => {
  let decrypted = CryptoJS.AES.decrypt(
    encryptedData,
    "LocalNotesSecureExport"
  ).toString();
  return CryptoJS.AES.encrypt(decrypted, await getDeviceIdHash()).toString();
};

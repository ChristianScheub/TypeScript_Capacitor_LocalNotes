import CryptoJS from "crypto-js";

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

export const encryptAndStore = (
  text: string,
  password: string,
  storageKey: string
): void => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = deriveKeyPBKDF2(password, salt);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const encryptedData = `${encrypted.toString()}::${iv.toString()}::${salt.toString()}`;
  localStorage.setItem(storageKey, encryptedData);
};

export const decryptFromStorage = (
  password: string,
  storageKey: string
): string => {
  console.log(password);
  console.log(storageKey);
  const encryptedData = localStorage.getItem(storageKey);

  if (!encryptedData) {
    console.log(encryptedData);
    return "";
  }

  const [encryptedText, iv, salt] = encryptedData.split("::");
  const key = deriveKeyPBKDF2(password, CryptoJS.enc.Hex.parse(salt));

  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

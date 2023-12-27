import * as CryptoJS from 'crypto-js';
import { makeReadyForExport, makeReadyForImport,getDeviceIdHash } from './encryptionEngine'; // Adjust this import path to your actual file
import { Device } from "@capacitor/device";

describe('Encryption Tests', () => {

  it('should properly encrypt and decrypt data for export', async () => {
    const decryptedText = 'test-data';

    const encryptedData = CryptoJS.TripleDES.encrypt(
        decryptedText,
        await getDeviceIdHash()
      ).toString();

    const exportReadyData = await makeReadyForExport(encryptedData);

    const importReadyData = await makeReadyForImport(exportReadyData);

    const decryptedDateWithDeviceId = CryptoJS.TripleDES.decrypt(
        importReadyData,
        await getDeviceIdHash()
      ).toString(CryptoJS.enc.Utf8);

    expect(decryptedText).toBe(decryptedDateWithDeviceId);
  });

});

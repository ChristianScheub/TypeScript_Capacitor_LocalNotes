import { renderHook} from "@testing-library/react";
import { encryptAndStore } from "../encryptionEngine";


import getAllNotes from './getNotes';


const mockEncryptionKey = "some-encryption-key";


describe('useNotes', () => {

  it('should load and decrypt notes correctly', () => {
    localStorage.clear();
    encryptAndStore('{"additionalInfo": "","title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"Tescht"}', mockEncryptionKey,"1",);
    const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));

    expect(result.current).toEqual([
      {
        additionalInfo: "",
        content: "Tescht",
        title: "TestTitel",
        id: "1",
        date: new Date("2023-12-09T20:10:56.534Z")
      }
    ]);
  });

  it('should handle decryption error gracefully', () => {
    localStorage.clear();
    localStorage.setItem("404040",'{"title":"FirstTitle","date":"2023-12-09T12:35:44.679Z","content":"Test1"}');
    const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));

    expect(result).toEqual({"current": []});
  });

  it('should handle without crash when nothing is here', () => {
    localStorage.clear();
    const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));
    expect(result).toEqual({"current": []});
  });

  it('should not crash with invalid/empty key', () => {
    localStorage.clear();
    localStorage.setItem("", 'TWRYwrsb0N89d8BYFwSlpH89N68amfV2abz8vNvd8n7Bju9UJhBZ8jp3nEWUE388sKA');
    const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));
    expect(result).toEqual({"current": []});
  });

  it('should not crash with invalid/empty text', () => {
    localStorage.clear();
    localStorage.setItem("1", '');
    const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));
    expect(result).toEqual({"current": []});
  });
  
});

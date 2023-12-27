import { renderHook, waitFor } from "@testing-library/react";
import { encryptAndStore } from "../encryptionEngine";
import { act } from "react-dom/test-utils";
import getAllNotes from "./getNotes";

const mockEncryptionKey = "some-encryption-key";
interface Note {
  id: string;
  content: string;
  title: string;
  date: Date;
  additionalInfo: String;
}

describe("useNotes", () => {
  it("should load and decrypt notes correctly", async () => {
    await encryptAndStore(
      '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"TeschtTescht"}',
      mockEncryptionKey,
      "1"
    );
  
    let hookResult: { current: Note[] | null };
    await act(async () => {
      const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));
       hookResult = result;
    });
  
    await waitFor(() => {
      expect(hookResult.current).toEqual([
        {
          additionalInfo: "",
          content: "TeschtTescht",
          title: "TestTitel",
          id: "1",
          date: new Date("2023-12-09T20:10:56.534Z"),
        },
      ]);
    });
  });

  it("should handle decryption error gracefully", async () => {
    localStorage.clear();
    localStorage.setItem(
      "404040",
      '{"title":"FirstTitle","date":"2023-12-09T12:35:44.679Z","content":"Test1"}'
    );

    await act(async () => {
      let result = renderHook(
        async () => await getAllNotes(mockEncryptionKey, "")
      ).result;

      await waitFor(() => {
        expect(result).toEqual({ current: null });
      });
    });
  });

  it("should handle without crash when nothing is here", async () => {
    localStorage.clear();
    await act(async () => {
      let result = renderHook(
        async () => await getAllNotes(mockEncryptionKey, "")
      ).result;

      await waitFor(() => {
        expect(result).toEqual({ current: null });
      });
    });
  });

  it("should not crash with invalid/empty key", async () => {
    localStorage.clear();
    localStorage.setItem(
      "",
      "TWRYwrsb0N89d8BYFwSlpH89N68amfV2abz8vNvd8n7Bju9UJhBZ8jp3nEWUE388sKA"
    );
    await act(async () => {
      let result = renderHook(
        async () => await getAllNotes(mockEncryptionKey, "")
      ).result;

      await waitFor(() => {
        expect(result).toEqual({ current: null });
      });
    });
  });

  it("should not crash with invalid/empty text", async () => {
    localStorage.clear();
    localStorage.setItem("1", "");
    await act(async () => {
      let result = renderHook(
        async () => await getAllNotes(mockEncryptionKey, "")
      ).result;

      await waitFor(() => {
        expect(result).toEqual({ current: null });
      });
    });
  });
});

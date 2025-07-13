import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderHook } from "@testing-library/react";
import getAllNotes from "../viewNote/getNotes";
import { BrowserRouter as Router } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import EditNoteContainer from "./container-editNote";
import { encryptAndStore, decryptFromStorage } from "../encryptionEngine";
import { act } from "react";
import { useState, useEffect } from "react";

const mockEncryptionKey = "some-encryption-key";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ noteId: "22" }),
  useNavigate: () => mockedNavigate,
}));

beforeEach(async () => {
  localStorage.clear();
  await encryptAndStore(
    '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"Tescht"}',
    mockEncryptionKey,
    "22"
  );
  await encryptAndStore(
    '{"title":"second","date":"2023-12-09T20:10:56.534Z","content":"zwei"}',
    mockEncryptionKey,
    "2"
  );
});

interface Note {
  id: string;
  content: string;
  title: string;
  date: Date;
  additionalInfo: String;
}

describe("EditNote Component", () => {
  it("renders with correct data from local storage", async () => {
    act(() => {
      render(
        <Router>
          <EditNoteContainer encryptionKey="some-encryption-key" />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("TestTitel")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Tescht")).toBeInTheDocument();
    });
  });

  it("renders with empty fields when no noteId is provided", async () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: () => ({}),
    }));
    localStorage.clear();
    act(() => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );
    });

    const titleInput = screen.getByTestId("noteTitleTest") as HTMLInputElement;
    const contentTextArea = screen.getByTestId(
      "noteTextTest"
    ) as HTMLTextAreaElement;

    expect(titleInput.value).toBe("");
    expect(contentTextArea.value).toBe("");
  });

  it("handles input changes correctly", async () => {
    await act(async () => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );
    });

    await waitFor(() => {
      const titleInput = screen.getByTestId(
        "noteTitleTest"
      ) as HTMLInputElement;
      const contentTextArea = screen.getByTestId(
        "noteTextTest"
      ) as HTMLTextAreaElement;

      fireEvent.change(titleInput, { target: { value: "New Title" } });
      fireEvent.change(contentTextArea, { target: { value: "New Content" } });

      expect(titleInput.value).toBe("New Title");
      expect(contentTextArea.value).toBe("New Content");
    });
  });

  it("handles input changes and save button click correctly", async () => {
    await act(async () => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );
    });
    await waitFor(() => {
      const titleInput = screen.getByTestId(
        "noteTitleTest"
      ) as HTMLInputElement;
      const contentTextArea = screen.getByTestId(
        "noteTextTest"
      ) as HTMLTextAreaElement;

      fireEvent.change(titleInput, { target: { value: "New Title" } });
      fireEvent.change(contentTextArea, { target: { value: "New Content" } });

      expect(titleInput.value).toBe("New Title");
      expect(contentTextArea.value).toBe("New Content");

      const oldValue = decryptFromStorage(mockEncryptionKey, "22");

      fireEvent.click(screen.getByTestId("floating-btn"));
      expect(mockedNavigate).toHaveBeenCalledWith(-1);
      expect(decryptFromStorage(mockEncryptionKey, "22")).not.toBe(oldValue);
    });
  });


  const isJsonString = (str: string): boolean => {
    try {
      const data = JSON.parse(str);
      const test = data.content + data.title;
      return true;
    } catch (e) {
      return false;
    }
  };

  it("renders with empty fields and save button click", async () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: () => ({}),
    }));
    localStorage.clear();

    await act(async () => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );
    });
    await waitFor(() => {
      const titleInput = screen.getByTestId(
        "noteTitleTest"
      ) as HTMLInputElement;
      const contentTextArea = screen.getByTestId(
        "noteTextTest"
      ) as HTMLTextAreaElement;

      fireEvent.change(titleInput, {
        target: { value: "New Title of new Note Now" },
      });
      fireEvent.change(contentTextArea, {
        target: { value: "New Content of new Note Now" },
      });

      expect(titleInput.value).toBe("New Title of new Note Now");
      expect(contentTextArea.value).toBe("New Content of new Note Now");
      fireEvent.click(screen.getByTestId("floating-btn"));
    });

    //Now check if note is really stored
      const loadedNotes: Note[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const originalText = await decryptFromStorage(mockEncryptionKey, key);
            if (originalText && isJsonString(originalText)) {
              const noteData = JSON.parse(originalText);
              loadedNotes.push({
                id: key,
                content: noteData.content,
                title: noteData.title,
                date: new Date(noteData.date),
                additionalInfo: "",
              });
            }
          } catch (error) {
            //console.log("Decryption or JSON parsing failed", error);
          }
        }
      }
      const filteredNotes = loadedNotes.filter((note) =>
        note.content.toLowerCase().includes("".toLowerCase())
      );
      filteredNotes.sort((a, b) => b.date.getTime() - a.date.getTime());

      const notes=filteredNotes;

    
      await waitFor(() => {
        expect(notes).toEqual([
          {
            additionalInfo: "",
            content: "New Content of new Note Now",
            title: "New Title of new Note Now",
            id: expect.any(String),
            date: expect.any(Date),
          },
        ]);
      
    });
  });
});

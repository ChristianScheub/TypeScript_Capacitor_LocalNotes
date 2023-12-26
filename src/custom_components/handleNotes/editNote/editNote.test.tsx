import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderHook } from "@testing-library/react";
import getAllNotes from "../viewNote/getNotes";
import { BrowserRouter as Router } from "react-router-dom";
import EditNoteContainer from "./container-editNote";
import { encryptAndStore, decryptFromStorage } from "../encryptionEngine";
import { act } from "react-dom/test-utils";

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
     act(async () => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );

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
  });

  it("handles input changes and save button click correctly", async () => {
    act(async () => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );

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
  });

  it("renders with empty fields and save button click", async () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: () => ({}),
    }));
    localStorage.clear();

    act(async () => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );

      await waitFor(() => {
        const titleInput = screen.getByTestId(
          "noteTitleTest"
        ) as HTMLInputElement;
        const contentTextArea = screen.getByTestId(
          "noteTextTest"
        ) as HTMLTextAreaElement;

        expect(titleInput.value).toBe("");

        fireEvent.change(titleInput, {
          target: { value: "New Title of new Note Now" },
        });
        fireEvent.change(contentTextArea, {
          target: { value: "New Content of new Note Now" },
        });

        expect(titleInput.value).toBe("New Title of new Note Now");
        expect(contentTextArea.value).toBe("New Content of new Note Now");

        fireEvent.click(screen.getByTestId("floating-btn"));

        const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));

        const containsTestText = result.current.some(
          (note) => note.content.includes("") || note.title.includes("")
        );

        expect(containsTestText).toBeTruthy();
      });
    });
  });

  it("can handles save correctly when new note", async () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      noteId: null,
    });

    act(async () => {
      render(
        <Router>
          <EditNoteContainer encryptionKey={mockEncryptionKey} />
        </Router>
      );
      await waitFor(() => {
        fireEvent.click(screen.getByTestId("floating-btn"));
        expect(mockedNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });
});

import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderHook } from "@testing-library/react";
import getAllNotes from "../viewNote/getNotes";
import { BrowserRouter as Router } from "react-router-dom";
import EditNoteContainer from "./container-editNote";
import { encryptAndStore, decryptFromStorage } from "../encryptionEngine";

const mockEncryptionKey = "some-encryption-key";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ noteId: "22" }),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  localStorage.clear();
  encryptAndStore(
    '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"Tescht"}',
    mockEncryptionKey,
    "1"
  );
  encryptAndStore(
    '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"Tescht"}',
    mockEncryptionKey,
    "22"
  );
});

describe("EditNote Component", () => {
  it("renders with correct data from local storage", () => {
    const { getByDisplayValue } = render(
      <Router>
        <EditNoteContainer encryptionKey="some-encryption-key" />
      </Router>
    );

    expect(getByDisplayValue("TestTitel")).toBeInTheDocument();
    expect(getByDisplayValue("Tescht")).toBeInTheDocument();
  });

  it("renders with empty fields when no noteId is provided", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: () => ({}),
    }));
    localStorage.clear();

    const { getByTestId } = render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );

    const titleInput = getByTestId("noteTitleTest") as HTMLInputElement;
    const contentTextArea = getByTestId("noteTextTest") as HTMLTextAreaElement;

    expect(titleInput.value).toBe("");
    expect(contentTextArea.value).toBe("");
  });

  it("handles input changes correctly", () => {
    const { getByTestId } = render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );

    const titleInput = getByTestId("noteTitleTest") as HTMLInputElement;
    const contentTextArea = getByTestId("noteTextTest") as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: "New Title" } });
    fireEvent.change(contentTextArea, { target: { value: "New Content" } });

    expect(titleInput.value).toBe("New Title");
    expect(contentTextArea.value).toBe("New Content");
  });

  it("handles input changes and save button click correctly", () => {
    const { getByTestId } = render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );

    const titleInput = getByTestId("noteTitleTest") as HTMLInputElement;
    const contentTextArea = getByTestId("noteTextTest") as HTMLTextAreaElement;

    fireEvent.change(titleInput, { target: { value: "New Title" } });
    fireEvent.change(contentTextArea, { target: { value: "New Content" } });

    expect(titleInput.value).toBe("New Title");
    expect(contentTextArea.value).toBe("New Content");

    const oldValue = decryptFromStorage(mockEncryptionKey, "22");

    fireEvent.click(getByTestId("floating-btn"));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
    expect(decryptFromStorage(mockEncryptionKey, "22")).not.toBe(oldValue);
  });

  it("renders with empty fields and save button click", () => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useParams: () => ({}),
    }));
    localStorage.clear();

    const { getByTestId } = render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );

    const titleInput = getByTestId("noteTitleTest") as HTMLInputElement;
    const contentTextArea = getByTestId("noteTextTest") as HTMLTextAreaElement;

    expect(titleInput.value).toBe("");
    expect(contentTextArea.value).toBe("");

    fireEvent.change(titleInput, {
      target: { value: "New Title of new Note" },
    });
    fireEvent.change(contentTextArea, {
      target: { value: "New Content of new Note" },
    });

    expect(titleInput.value).toBe("New Title of new Note");
    expect(contentTextArea.value).toBe("New Content of new Note");

    fireEvent.click(getByTestId("floating-btn"));

    const { result } = renderHook(() => getAllNotes(mockEncryptionKey, ""));

    const containsTestText = result.current.some(
      (note) =>
        note.content.includes("New Content of new Note") ||
        note.title.includes("New Title of new Note")
    );

    expect(containsTestText).toBeTruthy();
  });

  it("handles noteId being null", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      noteId: null,
    });
    const { getByTestId } = render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );
    const saveBtn = getByTestId("floating-btn");
    expect(saveBtn).toBeInTheDocument();
  });

  it("can handles save correctly when new note", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      noteId: null,
    });
    const { getByTestId } = render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );
    fireEvent.click(getByTestId("floating-btn"));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});

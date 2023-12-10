import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { renderHook } from "@testing-library/react";
import getAllNotes from "./getNotes";
import { BrowserRouter as Router } from "react-router-dom";
import EditNote from "./editNote";
import { encryptAndStore, decryptFromStorage } from "./encryptionEngine";
import * as reactRouterDom from "react-router-dom";

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
        <EditNote encryptionKey="some-encryption-key" />
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
        <EditNote encryptionKey={mockEncryptionKey} />
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
        <EditNote encryptionKey={mockEncryptionKey} />
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
        <EditNote encryptionKey={mockEncryptionKey} />
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
        <EditNote encryptionKey={mockEncryptionKey} />
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

  it("handles delete correctly", () => {
    global.confirm = jest.fn(() => true);
    const { getByTestId } = render(
      <Router>
        <EditNote encryptionKey={mockEncryptionKey} />
      </Router>
    );
    const deleteButton = getByTestId("delete-note-button");

    fireEvent.click(deleteButton);
    expect(global.confirm).toHaveBeenCalledWith(
      "Sind Sie sicher, dass Sie diese Notiz löschen möchten?"
    );
    expect(localStorage.getItem("22")).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("handles delete correctly when not confirmed", () => {
    global.confirm = jest.fn(() => false);
    const { getByTestId } = render(
      <Router>
        <EditNote encryptionKey={mockEncryptionKey} />
      </Router>
    );
    const deleteButton = getByTestId("delete-note-button");

    fireEvent.click(deleteButton);
    expect(localStorage.getItem("22")).not.toBeNull();
  });

  it("handles noteId being null", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      noteId: null,
    });
    const { getByTestId } = render(
      <Router>
        <EditNote encryptionKey={mockEncryptionKey} />
      </Router>
    );
    const deleteButton = getByTestId("delete-note-button");
    expect(deleteButton).toBeInTheDocument();
  });

  it("can handles save correctly when new note", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      noteId: null,
    });
    const { getByTestId } = render(
      <Router>
        <EditNote encryptionKey={mockEncryptionKey} />
      </Router>
    );
    fireEvent.click(getByTestId("floating-btn"));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});

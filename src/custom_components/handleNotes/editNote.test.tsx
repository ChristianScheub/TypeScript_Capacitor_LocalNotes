import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EditNote from "./editNote";
import { BrowserRouter } from "react-router-dom";

import CryptoJS from "crypto-js";

const mockedNavigate = jest.fn();
const mockedUseParams = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useParams: () => mockedUseParams(),
}));

describe("EditNote", () => {
  const encryptionKey = "test-key";
  const testNoteId = "test-note-id";
  const testNoteContent = "Test note content";

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseParams.mockReturnValue({ noteId: testNoteId });
    const encryptedContent = CryptoJS.AES.encrypt(
      testNoteContent,
      encryptionKey
    ).toString();
    localStorage.setItem(testNoteId, encryptedContent);
  });

  afterEach(() => {
    localStorage.removeItem(testNoteId);
  });

  it("renders the EditNote component", () => {
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    expect(screen.getByText("Notiz bearbeiten")).toBeInTheDocument();
  });

  it("renders the EditNote component with empty localStorage", () => {
    localStorage.clear();
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    expect(screen.getByText("Notiz bearbeiten")).toBeInTheDocument();
  });

  it("loads a note if noteId is present", () => {
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    expect(screen.getByDisplayValue(testNoteContent)).toBeInTheDocument();
  });

  it("handles save correctly", () => {
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    const saveButton = screen.getByTestId("save-note-button");
    fireEvent.click(saveButton);
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("updates noteContent on user input and store it", () => {
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );

    const oldValue = localStorage.getItem(testNoteId);
    const inputElement = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(inputElement, { target: { value: "new note content" } });
    expect(inputElement.value).toBe("new note content");
    const saveButton = screen.getByTestId("save-note-button");
    fireEvent.click(saveButton);
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
    expect(localStorage.getItem(testNoteId)).not.toBe(oldValue);
  });

  it("handles delete correctly", () => {
    global.confirm = jest.fn(() => true);
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    const deleteButton = screen.getByTestId("delete-note-button");

    fireEvent.click(deleteButton);
    expect(global.confirm).toHaveBeenCalledWith(
      "Sind Sie sicher, dass Sie diese Notiz löschen möchten?"
    );
    expect(localStorage.getItem(testNoteId)).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("handles delete correctly when not confirmed", () => {
    global.confirm = jest.fn(() => false);
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    const deleteButton = screen.getByTestId("delete-note-button");

    fireEvent.click(deleteButton);
    expect(localStorage.getItem(testNoteId)).not.toBeNull();
  });

  it("handles noteId being null", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      noteId: null,
    });
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    const deleteButton = screen.getByTestId("delete-note-button");
    expect(deleteButton).toBeInTheDocument();
  });

  it("can handles save correctly when new note", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
        noteId: null,
      });
    render(
      <BrowserRouter>
        <EditNote encryptionKey={encryptionKey} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("save-note-button"));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });
});

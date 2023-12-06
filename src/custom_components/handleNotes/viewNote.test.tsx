import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewNote from "./viewNote";
import { BrowserRouter as Router } from "react-router-dom";
import CryptoJS from "crypto-js";

const mockEncryptionKey = "some-encryption-key";
const mockSearchQuery = "";

const saveNoteToLocalStorage = (
  id: string,
  content: string,
  encryptionKey: string
): void => {
  const encryptedNote: string = CryptoJS.AES.encrypt(
    content,
    encryptionKey
  ).toString();
  localStorage.setItem(id, encryptedNote);
};

describe("ViewNote Component", () => {
  beforeEach(() => {
    localStorage.clear();
    saveNoteToLocalStorage("note1", "Test Note 1", mockEncryptionKey);
    saveNoteToLocalStorage("note2", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.nfjsnfwejfnefdjnsedsdnsendisediindis", mockEncryptionKey);
  });

  test("should render notes from local storage", () => {
    render(
      <Router>
        <ViewNote
          encryptionKey={mockEncryptionKey}
          searchQuery={mockSearchQuery}
        />
      </Router>
    );
    expect(screen.getByText("Test Note 1")).toBeInTheDocument();
    expect(screen.getByText("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam volu...")).toBeInTheDocument();
  });

  test("should navigate to edit page on note click", async () => {
    render(
      <Router>
        <ViewNote
          encryptionKey={mockEncryptionKey}
          searchQuery={mockSearchQuery}
        />
      </Router>
    );

    fireEvent.click(screen.getByText("Test Note 1"));
    await waitFor(() => {
      expect(window.location.pathname).toBe("/edit/note1");
    });
  });

  test("should navigate to add note page on add button click", () => {
    render(
      <Router>
        <ViewNote
          encryptionKey={mockEncryptionKey}
          searchQuery={mockSearchQuery}
        />
      </Router>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(window.location.pathname).toBe("/edit/new");
  });
});

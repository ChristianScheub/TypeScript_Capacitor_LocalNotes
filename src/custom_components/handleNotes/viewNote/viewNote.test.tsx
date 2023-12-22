import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewNoteContainer from "./container-viewNote";
import { BrowserRouter as Router } from "react-router-dom";
import { encryptAndStore } from "../encryptionEngine";

const mockEncryptionKey = "some-encryption-key";
const mockSearchQuery = "";

describe("ViewNote Component", () => {
  beforeEach(() => {
    localStorage.clear();
    encryptAndStore(
      '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"TeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTeschtTescht"}',
      mockEncryptionKey,
      "1"
    );
    encryptAndStore(
      '{"title":"second","date":"2023-12-09T20:10:56.534Z","content":"zwei"}',
      mockEncryptionKey,
      "2"
    );
  });

  test("should render notes from local storage", () => {
    render(
      <Router>
        <ViewNoteContainer
          encryptionKey={mockEncryptionKey}
          searchQuery={mockSearchQuery}
        />
      </Router>
    );
    expect(screen.getByText("TestTitel")).toBeInTheDocument();
    expect(screen.getByText("second")).toBeInTheDocument();
  });

  test("should navigate to edit page on note click", async () => {
    render(
      <Router>
        <ViewNoteContainer
          encryptionKey={mockEncryptionKey}
          searchQuery={mockSearchQuery}
        />
      </Router>
    );

    fireEvent.click(screen.getByText("TestTitel"));
    expect(window.location.pathname).toBe("/edit/1");
  });

  test("should navigate to add note page on add button click", () => {
    render(
      <Router>
        <ViewNoteContainer
          encryptionKey={mockEncryptionKey}
          searchQuery={mockSearchQuery}
        />
      </Router>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(window.location.pathname).toBe("/edit/new");
  });
});

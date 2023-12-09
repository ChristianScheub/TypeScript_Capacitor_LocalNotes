import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewNote from "./viewNote";
import { BrowserRouter as Router } from "react-router-dom";
import CryptoJS from "crypto-js";
import { encryptAndStore } from "./encryptionEngine";


const mockEncryptionKey = "some-encryption-key";
const mockSearchQuery = "";


describe("ViewNote Component", () => {
  beforeEach(() => {
    localStorage.clear();
    encryptAndStore('{"title":"FirstTitle","date":"2023-12-09T12:35:44.679Z","content":"Test1"}', mockEncryptionKey,"note1",);
    encryptAndStore( '{"title":"SecondTitle","date":"2023-12-09T14:35:44.679Z","content":"Test2"}', mockEncryptionKey,"note2",);
  });

  test("should render notes from local storage", () => {
    encryptAndStore('{"title":"FirstTitle","date":"2023-12-09T12:35:44.679Z","content":"Test1"}', mockEncryptionKey,"note1",);
    encryptAndStore( '{"title":"SecondTitle","date":"2023-12-09T14:35:44.679Z","content":"Test2"}', mockEncryptionKey,"note2",);
    render(
      <Router>
        <ViewNote
          encryptionKey={mockEncryptionKey}
          searchQuery={mockSearchQuery}
        />
      </Router>
    );
    expect(screen.getByText("FirstTitle")).toBeInTheDocument();
    expect(screen.getByText("Test1")).toBeInTheDocument();
    expect(screen.getByText("Test2")).toBeInTheDocument();
    expect(screen.getByText("SecondTitl...")).toBeInTheDocument();


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

    fireEvent.click(screen.getByText("FirstTitle"));
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

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  encryptAndStore,
  decryptFromStorage,
} from "./custom_components/handleNotes/encryptionEngine";

const mockEncryptionKey = "some-encryption-key";

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

describe("App Component", () => {
  test("renders without crashing", () => {
    const renderResult = () => renderWithRouter(<App />);
    expect(renderResult).not.toThrow();
  });

  test("renders encryption key modal on start", () => {
    const { getByTestId } = renderWithRouter(<App />);
    expect(getByTestId("password-input")).toBeInTheDocument();
  });

  test("closes modal on submit", async () => {
    const { getByText, queryByText } = renderWithRouter(<App />);
    const submitButton = getByText("Weiter");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(queryByText(/Encryption Key/i)).not.toBeInTheDocument();
    });
  });

  test("closes modal on submit", async () => {
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
    const { getByText, queryByText,getByTestId } = renderWithRouter(<App />);

    const input = getByTestId("password-input");
    fireEvent.change(input, { target: { value: mockEncryptionKey } });

    const submitButton = getByText("Weiter");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(queryByText(/Encryption Key/i)).not.toBeInTheDocument();
      const noteFirst = getByText("TestTitel");
      expect(queryByText(/TestTitel/i)).toBeInTheDocument();
      fireEvent.click(noteFirst);
      expect(window.location.pathname).toBe("/edit/1");
    });
      
  });
});

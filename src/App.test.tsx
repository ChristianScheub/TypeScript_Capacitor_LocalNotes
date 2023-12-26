import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  encryptAndStore,
  decryptFromStorage,
} from "./custom_components/handleNotes/encryptionEngine";
import { act } from "react-dom/test-utils";

const mockEncryptionKey = "some-encryption-key";

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

jest.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: jest.fn(),
  },
}));

describe("App Component", () => {
  test("renders without crashing", () => {
    const renderResult = () => renderWithRouter(<App />);
    expect(renderResult).not.toThrow();
  });

  test("renders encryption key modal on start", () => {
    const { getByTestId } = renderWithRouter(<App />);
    expect(getByTestId("password-input")).toBeInTheDocument();
  });

  test("closes modal not when not submit when data are insert", async () => {
    render(<App />);
    const submitButton = screen.getByTestId("password-inputBtn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId("password-inputBtn")).toBeInTheDocument();
    });
  });

  test("closes modal on submit when data are insert", async () => {
    render(<App />);
    const input = screen.getByTestId("password-input");
    fireEvent.change(input, { target: { value: mockEncryptionKey } });

    const submitButton = screen.getByTestId("password-inputBtn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId("password-inputBtn")).not.toBeInTheDocument();
    });
  });

});

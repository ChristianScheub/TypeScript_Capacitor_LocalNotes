import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  encryptAndStore,
  decryptFromStorage,
  getPBKDF2_Password
} from "./custom_components/handleNotes/encryptionEngine";
import { act } from "react";


const mockEncryptionKey = "some-encryption-key";

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

jest.mock("capacitor-native-biometric", () => ({
  NativeBiometric: {
    isAvailable: jest.fn(),
  },
}));

jest.mock('./custom_components/handleNotes/encryptionEngine', () => ({
  getPBKDF2_Password: jest.fn().mockImplementation(password => password),
}));


describe("App Component", () => {
  beforeEach(() => {
    (getPBKDF2_Password as jest.Mock).mockImplementation(password => password);
  });

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
    await act(() => {
      const submitButton = screen.getByTestId("password-inputBtn");
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("password-inputBtn")).toBeInTheDocument();
    });
  });

  test("closes modal on submit when data are insert", async () => {
    render(<App />);
    const input = screen.getByTestId("password-input");
    await act(() => {
      fireEvent.change(input, { target: { value: mockEncryptionKey } });

      const submitButton = screen.getByTestId("password-inputBtn");
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("password-inputBtn")).not.toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EncryptionKeyModal from "./encryption_modal";
import { BrowserRouter as Router } from "react-router-dom";

describe("<EncryptionKeyModal />", () => {
  it("renders without crashing", () => {
    render(
      <Router>
        <EncryptionKeyModal onSubmit={() => {}} />
      </Router>
    );
    expect(screen.getByText("Passwort eingeben")).toBeInTheDocument();
    expect(screen.getByTestId("floating-btn")).toBeInTheDocument();
  });

  it("submits the form with the entered encryption key", () => {
    const onSubmitMock = jest.fn();
    render(
      <Router>
        <EncryptionKeyModal onSubmit={onSubmitMock} />
      </Router>
    );
    const input = screen.getByTestId("password-input");
    fireEvent.change(input, { target: { value: "test123" } });
    fireEvent.click(screen.getByText("Weiter"));
    expect(onSubmitMock).toHaveBeenCalledWith("test123");
  });

  it('navigates to privacy policy page on privacy button click', () => {
    render(
      <Router>
        <EncryptionKeyModal onSubmit={() => {}} />
      </Router>
    );


    const privacyButton2 = screen.getByTestId("floating-btn")
    fireEvent.click(privacyButton2);

    expect(window.location.pathname).toBe("/datenschutz");

  });
});

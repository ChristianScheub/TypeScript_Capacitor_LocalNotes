import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EncryptionKeyModal from "./encryption_modal"; // Adjust the import path as necessary

describe("<EncryptionKeyModal />", () => {

  it("renders without crashing", () => {
    render(
      <EncryptionKeyModal show={true} onHide={() => {}} onSubmit={() => {}} />
    );
    expect(screen.getByText("Verschlüsselungscode")).toBeInTheDocument();
  });

it("submits the form with the entered encryption key", () => {
  const onSubmitMock = jest.fn();
  const onHideMock = jest.fn();
  render(
    <EncryptionKeyModal
      show={true}
      onHide={onHideMock}
      onSubmit={onSubmitMock}
    />
  );
  const input = screen.getByTestId('password-input');
  fireEvent.change(input, { target: { value: "test123" } });
  fireEvent.click(screen.getByText("Los!"));
  expect(onSubmitMock).toHaveBeenCalledWith("test123");
  expect(onHideMock).toHaveBeenCalled();
});


it("does not render when show is false", () => {
  render(
    <EncryptionKeyModal show={false} onHide={() => {}} onSubmit={() => {}} />
  );
  expect(screen.queryByText("Verschlüsselungscode")).not.toBeInTheDocument();
});

});

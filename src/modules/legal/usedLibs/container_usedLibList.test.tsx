import React from "react";
import UsedLibsListContainer from "./container_usedLibList";
import {
    render,
    waitFor,
    act,
  } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

describe("UsedLibsListContainer", () => {
  test("renders button with correct text", () => {
    const { getByTestId } = render(<UsedLibsListContainer />);
    const buttonElement = getByTestId("usedLib_Open_Btn");
    expect(buttonElement).toBeInTheDocument();
  });

  test("clicking button opens modal", () => {
    const { getByTestId } = render(<UsedLibsListContainer />);
    const buttonElement = getByTestId("usedLib_Open_Btn");
    fireEvent.click(buttonElement);
    const modalElement = getByTestId("used-lib-list-modal");
    expect(modalElement).toBeInTheDocument();
  });

  test("closing modal works correctly", async () => {
    const { queryByTestId, getByTestId } = render(<UsedLibsListContainer />);
    fireEvent.click(getByTestId("usedLib_Open_Btn"));

    await act(async () => {
      fireEvent.click(getByTestId("close-btn-lib-list-modal"));
    });

    await waitFor(() => {
      expect(queryByTestId("used-lib-list-modal")).toBeNull();
    });
  });
});

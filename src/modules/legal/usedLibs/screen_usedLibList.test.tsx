import React from "react";
import { render } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import UsedLibListScreen from "./screen_usedLibList";

describe("UsedLibListScreen", () => {
  const mockNpmModules = [
    {
      name: "TestModule",
      version: "1.0.0",
      licenses: "MIT",
      repository: "https://github.com/test/module",
    },
  ];

  test("clicking list item opens module repository in new tab", () => {
    // Mock window.open
    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    const { getByText } = render(
      <UsedLibListScreen
        open={true}
        handleClose={() => {}}
        npmModules={mockNpmModules}
      />
    );
    const listItemElement = getByText("TestModule@1.0.0");
    expect(getByText("TestModule@1.0.0")).toBeInTheDocument();

    fireEvent.click(listItemElement);

    // Expect window.open to have been called with the correct URL and target
    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://github.com/test/module",
      "_blank"
    );

    // Restore the original implementation of window.open
    mockWindowOpen.mockRestore();
  });
});

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FloatingBtn from "./floatingBtn";

describe("FloatingBtn Component", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <FloatingBtn
        centered={true}
        icon={() => <div data-testid="icon" />}
        onClick={() => {}}
      />
    );

    const button = getByTestId("floating-btn");

    expect(button).toBeInTheDocument();
  });

  it("renders with centered position", () => {
    const { getByTestId } = render(
      <FloatingBtn
        centered={true}
        icon={() => <div data-testid="icon" />}
        onClick={() => {}}
      />
    );

    const button = getByTestId("floating-btn");
    expect(button).toBeInTheDocument();

    const icon = getByTestId("icon");
    expect(icon).toBeInTheDocument();


    const buttonStyles = window.getComputedStyle(getByTestId("floating-btnDiv"));
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
    expect(buttonStyles.getPropertyValue("left")).toBe("50%");
    expect(buttonStyles.getPropertyValue("transform")).toBe(
      "translate(-50%, -50%)"
    );
  });

  it("renders with right-aligned position", () => {
    const { getByTestId } = render(
      <FloatingBtn
        centered={false}
        icon={() => <div data-testid="icon" />}
        onClick={() => {}}
      />
    );

    const button = getByTestId("floating-btn");
    expect(button).toBeInTheDocument();

    const icon = getByTestId("icon");
    expect(icon).toBeInTheDocument();

    const buttonStyles = window.getComputedStyle(getByTestId("floating-btnDiv"));
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
    expect(buttonStyles.getPropertyValue("transform")).toBe(
      "translate(-50%, -50%)"
    );
    
  });
});

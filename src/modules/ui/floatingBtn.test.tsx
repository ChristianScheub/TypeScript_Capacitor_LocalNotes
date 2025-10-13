import React from "react";
import { render } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import FloatingBtn, { ButtonAlignment } from "./floatingBtn";

describe("FloatingBtn Component", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <FloatingBtn
        alignment={ButtonAlignment.CENTER}
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
        alignment={ButtonAlignment.CENTER}
        icon={() => <div data-testid="icon" />}
        onClick={() => {}}
      />
    );

    const button = getByTestId("floating-btn");
    expect(button).toBeInTheDocument();

    const icon = getByTestId("icon");
    expect(icon).toBeInTheDocument();

    const buttonStyles = window.getComputedStyle(
      getByTestId("floating-btnDiv")
    );
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
    expect(buttonStyles.getPropertyValue("left")).toBe("50%");
    expect(buttonStyles.getPropertyValue("transform")).toBe(
      "translate(-50%, -50%)"
    );
  });

  it("renders correct with right-aligned position", () => {
    const { getByTestId } = render(
      <FloatingBtn
      alignment={ButtonAlignment.RIGHT}
        icon={() => <div data-testid="icon" />}
        onClick={() => {}}
      />
    );

    const button = getByTestId("floating-btn");
    expect(button).toBeInTheDocument();

    const icon = getByTestId("icon");
    expect(icon).toBeInTheDocument();

    const buttonStyles = window.getComputedStyle(
      getByTestId("floating-btnDiv")
    );
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
    expect(buttonStyles.getPropertyValue("transform")).toBe(
      "translate(-50%, -50%)"
    );
    expect(buttonStyles.getPropertyValue("right")).toBe("0rem");
  });

  it("renders correct with left-aligned position", () => {
    const { getByTestId } = render(
      <FloatingBtn
      alignment={ButtonAlignment.LEFT}
        icon={() => <div data-testid="icon" />}
        onClick={() => {}}
      />
    );

    const button = getByTestId("floating-btn");
    expect(button).toBeInTheDocument();

    const icon = getByTestId("icon");
    expect(icon).toBeInTheDocument();

    const buttonStyles = window.getComputedStyle(
      getByTestId("floating-btnDiv")
    );
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
    expect(buttonStyles.getPropertyValue("transform")).toBe(
      "translate(50%, -50%)"
    );
    expect(buttonStyles.getPropertyValue("left")).toBe("0rem");

  });
});

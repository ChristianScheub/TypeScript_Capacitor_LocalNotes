import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import {
  MemoryRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import NavBar from "./navBar";
import "@testing-library/jest-dom";

const mockedNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockedNavigate,
    }));

describe("NavBar Component", () => {
  const mockSetSearchQuery = jest.fn();
  

  const renderNavBar = () =>
    render(
      <Router>
        <NavBar setSearchQuery={mockSetSearchQuery} />
      </Router>
    );

  it("should render the NavBar", () => {
    renderNavBar();
    expect(screen.getByPlaceholderText("Notizen suchen")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render the NavBar with search bar", () => {
    renderNavBar();
    expect(screen.getByPlaceholderText("Notizen suchen")).toBeInTheDocument();
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
  });

  it("should render the NavBar with back button", () => {
    render(
      <MemoryRouter initialEntries={["/datenschutz"]}>
        <NavBar setSearchQuery={mockSetSearchQuery} />
      </MemoryRouter>
    );
    expect(
      screen.queryByPlaceholderText("Notizen suchen")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("should render the NavBar with back button and handle click", () => {

    render(
      <MemoryRouter initialEntries={["/datenschutz"]}>
        <NavBar setSearchQuery={mockSetSearchQuery} />
      </MemoryRouter>
    );
    const backButton = screen.getByTestId("back-button");
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("should handle input change", () => {
    renderNavBar();
    const input = screen.getByPlaceholderText("Notizen suchen");
    fireEvent.change(input, { target: { value: "Neue Notiz" } });
    expect(mockSetSearchQuery).toHaveBeenCalledWith("Neue Notiz");
  });

  it("should handle form submit", () => {
    renderNavBar();
    const input = screen.getByPlaceholderText("Notizen suchen");
    fireEvent.change(input, { target: { value: "Neue Notiz" } });
    fireEvent.submit(input);
    expect(mockSetSearchQuery).toHaveBeenCalledWith("Neue Notiz");
  });

  it("should navigate to Impressum page on button click", () => {
    renderNavBar();
    const impressumButton = screen.getByRole("button");
    fireEvent.click(impressumButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/datenschutz");
  });
});

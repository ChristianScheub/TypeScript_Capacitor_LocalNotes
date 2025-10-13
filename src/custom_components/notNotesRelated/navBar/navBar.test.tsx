import React from "react";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import {
  MemoryRouter,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import NavBar from "./container-navBar";
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
    expect(screen.getByTestId("navbar_searchForm")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render the NavBar with search bar", () => {
    renderNavBar();
    expect(screen.getByTestId("navbar_searchForm")).toBeInTheDocument();
    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
  });

  it("should render the NavBar with back button", () => {
    render(
      <MemoryRouter initialEntries={["/datenschutz"]}>
        <NavBar setSearchQuery={mockSetSearchQuery} />
      </MemoryRouter>
    );
    expect(screen.queryByTestId("navbar_searchForm")).not.toBeInTheDocument();
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
    const input = screen.getByTestId("navbar_searchForm");
    fireEvent.change(input, { target: { value: "Neue Notiz" } });
    expect(mockSetSearchQuery).toHaveBeenCalledWith("Neue Notiz");
  });

  it("should handle form submit", () => {
    renderNavBar();
    const input =  screen.getByTestId("navbar_searchForm");
    fireEvent.change(input, { target: { value: "Neue Notiz" } });
    fireEvent.submit(input);
    expect(mockSetSearchQuery).toHaveBeenCalledWith("Neue Notiz");
  });

  it("should navigate to Settings page on button click", () => {
    renderNavBar();
    const settingsButton = screen.getByRole("button");
    fireEvent.click(settingsButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/settings");
  });

});

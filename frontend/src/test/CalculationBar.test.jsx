import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CalculationBar from "../CalculationBar";
import { expect, test, describe, vi } from "vitest";

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CalculationBar Component", () => {
  test("renders CalculationBar correctly", () => {
    render(
      <MemoryRouter initialEntries={["/calculator/general-data-entry"]}>
        <CalculationBar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Step 1: General Data Entry")).toBeInTheDocument();
    expect(screen.getByText("Step 2: Procurement")).toBeInTheDocument();
    expect(screen.getByText("Step 3: Results")).toBeInTheDocument();
  });

  test("hides CalculationBar when on /calculator", () => {
    render(
      <MemoryRouter initialEntries={["/calculator"]}>
        <CalculationBar />
      </MemoryRouter>,
    );

    expect(
      screen.queryByText("Step 1: General Data Entry"),
    ).not.toBeInTheDocument();
  });

  test("navigates when clicking a step", () => {
    render(
      <MemoryRouter initialEntries={["/calculator/general-data-entry"]}>
        <CalculationBar />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Step 2: Procurement"));
    expect(mockNavigate).toHaveBeenCalledWith("/calculator/procurement");
  });

  test("shows sub-steps when on Step 1", () => {
    render(
      <MemoryRouter initialEntries={["/calculator/general-data-entry"]}>
        <CalculationBar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Utilities")).toBeInTheDocument();
    expect(screen.getByText("Travel")).toBeInTheDocument();
    expect(screen.getByText("Waste")).toBeInTheDocument();
  });

  test("navigates when clicking a sub-step", () => {
    render(
      <MemoryRouter initialEntries={["/calculator/general-data-entry"]}>
        <CalculationBar />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Travel"));
    expect(mockNavigate).toHaveBeenCalledWith("/calculator/travel");
  });
});

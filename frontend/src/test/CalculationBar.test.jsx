import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CalculationBar from "../CalculationBar";
import { describe, test, expect } from "vitest";

describe("CalculationBar Component", () => {
  test("renders CalculationBar correctly", () => {
    render(
      <MemoryRouter initialEntries={["/calculator/general-data-entry"]}>
        <CalculationBar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Step 1: General Data Entry")).toBeInTheDocument();
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

  test("shows sub-steps when on Step 1", () => {
    render(
      <MemoryRouter initialEntries={["/calculator/utilities"]}>
        <CalculationBar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Utilities")).toBeInTheDocument();
    expect(screen.getByText("Travel")).toBeInTheDocument();
    expect(screen.getByText("Waste")).toBeInTheDocument();
  });
});

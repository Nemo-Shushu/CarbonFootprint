import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Dashboard } from "../Dashboard";
import { useAuth } from "../useAuth";
import { useState } from "react";

// Mock useAuth
vi.mock("../useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock React Bootstrap Modal
vi.mock("react-bootstrap/Modal", () => ({
  default: ({ show, children }) =>
    show ? <div data-testid="modal">{children}</div> : null,
}));

// Before each test, reset mocks
beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({ isAuthenticated: true, loading: false });
});

describe("Dashboard Component", () => {
  it("renders the Dashboard component", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: /dashboard/i }),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Available Reports").length).toBeGreaterThan(
        0,
      );
    });
  });
});

describe("Dashboard component - Table headers", () => {
  it("renders the table headers for normal users", async () => {
    const mockSetState = vi.fn();
    vi.spyOn(useState, "useState").mockReturnValue([
      false,
      mockSetState,
    ]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      const headers = screen
        .getAllByRole("columnheader")
        .map((th) => th.textContent);
      expect(headers).toEqual([
        "#",
        "Academic Institution",
        "Research Field",
        "Total Emissions",
      ]);
    });

    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  it("renders the table headers for admin users", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isAdmin: true }),
      }),
    );

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      const headers = screen
        .getAllByRole("columnheader")
        .map((th) => th.textContent);
      expect(headers).toEqual([
        "#",
        "Academic Institution",
        "Research Field",
        "Total Emissions",
      ]);
    });

    expect(screen.queryByText("Email")).toBeInTheDocument();
  });
});

describe("Dashboard Component - Authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false });
  });

  it("redirects to sign-in when not authenticated", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });
});

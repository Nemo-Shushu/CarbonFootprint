import { describe, test, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../Sidebar";

const mockFetch = (isAdmin) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          forename: "Test User",
          email: "test@example.com",
          isAdmin: isAdmin,
        }),
    }),
  );
};

describe("Sidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders 'Admin Tool' when user is an admin", async () => {
    mockFetch(true);

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Admin Tool")).toBeInTheDocument(),
    );

    expect(screen.queryByText("Request Admin")).toBeNull();
  });

  test("renders 'Request Admin' when user is not an admin", async () => {
    mockFetch(false);

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Request Admin")).toBeInTheDocument(),
    );

    expect(screen.queryByText("Admin Tool")).toBeNull();
  });

  test("does not render 'Request Admin' when user is an admin", async () => {
    mockFetch(true);

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Admin Tool")).toBeInTheDocument(),
    );

    expect(screen.queryByText("Request Admin")).toBeNull();
  });
});

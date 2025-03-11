import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, describe, beforeEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../RegisterForm";
import { useAuth } from "../useAuth";

// Mock `useAuth`
vi.mock("../useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock `useNavigate`
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock API 请求
global.fetch = vi.fn((url) => {
  if (url.includes("api2/institutions")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ name: "Test University" }]),
    });
  }
  if (url.includes("api2/fields")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ name: "Computer Science" }]),
    });
  }
  if (url.includes("api/accounts/register/")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  }
  return Promise.reject(new Error("API error"));
});

describe("RegisterForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Displays the form when user is not logged in", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false });

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    expect(screen.getByText("Create an Account")).toBeInTheDocument();
  });

  test("Redirects to sign-in when user is already authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false });

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

/* eslint-env jest, vitest */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignInForm from "../SignInForm";

// Mock `useAuth`
vi.mock("../useAuth", () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false, loading: false })),
}));

// Mock `useNavigate`
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock fetch Request to avoid connecting to the actual server
global.fetch = vi.fn((url, options) => {
  if (options.method === "POST") {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ isAuthenticated: true }),
    });
  }
  return Promise.reject(new Error("API error"));
});

describe("SignInForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls login function and navigates on successful login", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: "Login" });

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "mypassword");

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message on failed login", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 401,
        json: () => Promise.reject(new Error("Unauthorized")),
      }),
    );

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByPlaceholderText("Email Address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: "Login" });

    await userEvent.type(usernameInput, "wronguser");
    await userEvent.type(passwordInput, "wrongpassword");

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(
        screen.getByText("Wrong username or password"),
      ).toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByRole("button", { name: "Show" });

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    expect(toggleButton).toHaveTextContent("Hide");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
    expect(toggleButton).toHaveTextContent("Show");
  });
});

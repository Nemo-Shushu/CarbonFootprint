/* eslint-env jest, vitest */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignInForm from "../SignInForm";

// Mock `useAuth`
vi.mock("../../useAuth", () => ({
  useAuth: vi.fn(() => false),
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

// Mock `loginUser` API
vi.mock("../../SignInForm", () => ({
  loginUser: vi.fn(() => Promise.resolve({ success: true })), // Mock successfully
}));

// Mock fetch Request to avoid connecting to the actual server
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ isAuthenticated: true }), // return fake true
  }),
);

describe("SignInForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); //clear mock
  });

  it("calls loginUser and navigates on successful login", async () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign in" });

    // mock input
    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "mypassword");

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard"); // test the navigation
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RegisterForm from "../RegisterForm"; 
import { useAuth } from "../useAuth"; 

// Mock useAuth 
vi.mock("../useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("RegisterForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Display the form when not logged in, and jump when logged in", () => {
    useAuth.mockReturnValueOnce(false); // No Register
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
    expect(screen.getByTestId("register-title")).toBeInTheDocument();

    useAuth.mockReturnValueOnce(true); // Already has
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
  });
});

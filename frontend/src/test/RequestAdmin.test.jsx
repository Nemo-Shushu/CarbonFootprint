import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RequestAdmin from "../RequestAdmin";

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

describe("RequestAdmin Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Request Admin page when authenticated", () => {
    // Mock useAuth = true
    vi.mocked(require("../useAuth").useAuth).mockReturnValue(true);

    render(
      <MemoryRouter>
        <RequestAdmin />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: /request admin/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your reason")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("redirects to sign-in when not authenticated", async () => {
    // Mock useAuth = false
    vi.mocked(require("../useAuth").useAuth).mockReturnValue(false);

    render(
      <MemoryRouter>
        <RequestAdmin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
    });
  });

  it("shows an alert when Submit button is clicked", () => {
    vi.mocked(require("../useAuth").useAuth).mockReturnValue(true);
    global.alert = vi.fn(); // Mock alert

    render(
      <MemoryRouter>
        <RequestAdmin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(global.alert).toHaveBeenCalledWith("Your request has been submitted!");
  });

  it("navigates to dashboard when Back button is clicked", () => {
    vi.mocked(require("../useAuth").useAuth).mockReturnValue(true);

    render(
      <MemoryRouter>
        <RequestAdmin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

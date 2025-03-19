import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Dashboard } from "../Dashboard";
import { useAuth } from "../useAuth";
import { useEffect } from "react";

vi.mock("../Sidebar", () => ({ default: () => <div data-testid="sidebar" /> }));
vi.mock("../Profile", () => ({ default: () => <div data-testid="profile" /> }));
vi.mock("../ResultsDisplay", () => ({
  default: () => <div data-testid="results-display" />,
}));
vi.mock("react-bootstrap/Modal", () => ({
  default: ({ show }) => (show ? <div data-testid="modal" /> : null),
}));

vi.mock("../useAuth", () => ({
  useAuth: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();

  vi.doMock("../Sidebar", () => ({
    default: ({ onAdminStatusChange }) => {
      useEffect(() => {
        onAdminStatusChange(false); 
      }, []);
      return <div data-testid="sidebar" />;
    },
  }));
});


describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the Dashboard component", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it("displays 'No data available' when no reports exist", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("renders the table headers when data exists", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              institution: "MIT",
              field: "AI",
              emissions: 100,
              email: "test@example.com",
            },
          ]),
      }),
    );

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole("columnheader").length).toBe(4);
    });

    expect(screen.getByText("MIT")).toBeInTheDocument();
    expect(screen.getByText("Academic Institution")).toBeInTheDocument();
    expect(screen.getByText("Research Field")).toBeInTheDocument();
    expect(screen.getByText("Total Emissions")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("opens the modal when clicking a report row", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              institution: "MIT",
              field: "AI",
              emissions: 100,
              email: "test@example.com",
            },
          ]),
      }),
    );

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("MIT"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  it("toggles profile menu when clicking the profile image", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    const profileIcon = screen.getByTestId("profile-icon");
    fireEvent.click(profileIcon);

    expect(screen.getByTestId("profile-btn")).toBeInTheDocument();

  });

  it("renders the table headers for admin users", async () => {
    vi.doMock("../Sidebar", () => ({
      default: ({ onAdminStatusChange }) => {
        useEffect(() => {
          onAdminStatusChange(true); 
        }, []);
        return <div data-testid="sidebar" />;
      },
    }));
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              isAdmin: true,
              institution: "MIT",
              field: "AI",
              emissions: 100,
              email: "admin@example.com",
            },
          ]),
      }),
    );

    const { Dashboard } = await import("../Dashboard");

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
        "Email"
      ]);
    });
  });

  it("handles fetch failure gracefully", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network Error")));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
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

describe("Dashboard Component - Table headers", () => {
  it("renders the table headers for normal users", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              isAdmin: false,
              id: 1,
              institution: "MIT",
              field: "AI",
              emissions: 200,
            },
          ]),
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

    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  it("displays 'No data available' when no reports exist", async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes("dashboard_show_user_result_data")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error("Unexpected API call"));
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("No data available")).toBeInTheDocument();
      expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
    });
  });


  
  

});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Calculator } from "../calculator";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../Sidebar", () => ({ default: () => <div data-testid="sidebar" /> }));
vi.mock("../CalculationBar", () => ({
  default: () => <div data-testid="calculation-bar" />,
}));

describe("Calculator Component", () => {
  it("renders the Calculator component with sidebar and calculation bar", () => {
    render(
      <MemoryRouter>
        <Calculator />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("calculation-bar")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /carbon footprint calculator/i }),
    ).toBeInTheDocument();
  });

  it("navigates to the Utilities page when clicking Start", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Calculator />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /carbon footprint calculator/i }),
      ).toBeInTheDocument();
    });
  });

  it("navigates through all steps correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/utilities"]}>
        <Calculator />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("PERSONNEL")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) =>
          content.includes(
            "For calculating electricity and gas consumption",
          ),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) =>
          content.includes(
            "For calculating water consumption",
          ),
        ),
      ).toBeInTheDocument();
    });

    render(
      <MemoryRouter initialEntries={["/travel"]}>
        <Calculator />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("AIR TRAVEL")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes("SEA TRAVEL")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes("LAND TRAVEL")),
      ).toBeInTheDocument();
    });

    render(
      <MemoryRouter initialEntries={["/waste"]}>
        <Calculator />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("RECYCLING")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes("WASTE")),
      ).toBeInTheDocument();
    });

    render(
      <MemoryRouter initialEntries={["/procurement"]}>
        <Calculator />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes("Press + to add new lines"),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes("category")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) => content.includes("value")),
      ).toBeInTheDocument();
    });

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Calculator />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("Results")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content) =>
          content.includes("Data contributing to emissions"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("navigates utilities", async () => {
    render(
      <MemoryRouter>
        <Calculator />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/calculator/utilities");
    });
  });

  it("navigates travels", async () => {
    render(
      <MemoryRouter initialEntries={["/utilities"]}>
        <Calculator />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/calculator/travel");
    });
  });

  it("navigates waste", async () => {
    render(
      <MemoryRouter initialEntries={["/travel"]}>
        <Calculator />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
  });

  it("submits the report and navigates to dashboard", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Report saved successfully" }),
      }),
    );

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Calculator />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submit/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api2/submit/"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("navigates back from travel to utilities", async () => {
    render(
      <MemoryRouter initialEntries={["/travel"]}>
        <Calculator />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/calculator/utilities");
    });
  });

  it("handles fetch error on submitReport", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Calculator />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  });
});

describe("Procurement Component", () => {
  it("renders the Procurement component correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/procurement"]}>
        <Calculator />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Press + to add new lines"))).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("adds a new row when clicking + button", async () => {
    render(
      <MemoryRouter initialEntries={["/procurement"]}>
        <Calculator />
      </MemoryRouter>,
    );

    const addRowButton = screen.getByRole("button", { name: "+" });

    fireEvent.click(addRowButton);

    const categoryDropdown = screen.getByRole("combobox");
    fireEvent.change(categoryDropdown, { target: { value: "A" } });

    await waitFor(() => {
      expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    });
  });

  it("allows selecting a category from the dropdown", async () => {
    render(
      <MemoryRouter initialEntries={["/procurement"]}>
        <Calculator />
      </MemoryRouter>,
    );

    const addRowButton = screen.getByRole("button", { name: "+" });

    fireEvent.click(addRowButton);

    const categoryDropdown = screen.getByRole("combobox");
    fireEvent.change(categoryDropdown, { target: { value: "A" } });

    await waitFor(() => {
      expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    });

    expect(categoryDropdown.value).toBe("A");
  });

  it("deletes a row when clicking Delete", async () => {
    render(
      <MemoryRouter initialEntries={["/procurement"]}>
        <Calculator />
      </MemoryRouter>,
    );

    const addRowButton = screen.getByRole("button", { name: "+" });

    fireEvent.click(addRowButton);

    const categoryDropdown = screen.getByRole("combobox");
    fireEvent.change(categoryDropdown, { target: { value: "A" } });

    await waitFor(() => {
      expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    });

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByRole("textbox")).toBeNull();
    });
  });

  it("navigates to results when Next is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/procurement"]}>
        <Calculator />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/calculator/results");
    });
  });

  it("navigates back to waste when Back is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/procurement"]}>
        <Calculator />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/calculator/waste");
    });
  });
});

describe("Results Component", () => {
  it("renders the Results component correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Calculator />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /results/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("fetches calculation data and updates the state", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ total_emissions: 500 }),
      }),
    );

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Calculator />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api2/report/"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });
  });

  it("navigates back to procurement when Back is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Calculator />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/calculator/procurement");
    });
  });

  const mockSubmitReport = vi.fn();
  vi.mock("../submitReport", () => ({ default: mockSubmitReport }));

  it("calls submitReport when Submit is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/results"]}>
        <Calculator />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
  });
});

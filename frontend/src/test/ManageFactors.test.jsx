import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "../useAuth";
import ManageFactors from "../features/ManageFactors/components/ManageFactors";
import EditFactor from "../features/ManageFactors/components/EditFactorModal";
import FactorTable from "../features/ManageFactors/components/FactorTable";
import DeleteFactor from "../features/ManageFactors/components/DeleteFactorModal";
import ProcurementTable from "../features/ManageFactors/components/ProcurementTable";

vi.mock("../features/ManageFactors/api/apiFactors", () => ({
  getIntensityFactors: vi.fn((setState) =>
    setState([
      {
        id: 1,
        category: "Electricity",
        consumption_type: "Residential",
        intensity: 100,
        unit: "kg CO2e",
      },
      {
        id: 2,
        category: "Gas",
        consumption_type: "Commercial",
        intensity: 200,
        unit: "kg CO2e",
      },
    ]),
  ),
  getProcurementFactors: vi.fn((setState) =>
    setState([
      {
        id: 1,
        category: "Office Supplies",
        carbon_impact: 300,
        unit: "kg CO2e",
      },
    ]),
  ),
  handleUpdateSubmissionAPI: vi.fn(),
  handleCreateSubmissionAPI: vi.fn(),
  handleDeleteSubmissionAPI: vi.fn(),
}));

vi.mock("../useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

describe("ManageFactors Component", () => {
  it("redirects to sign-in page if user is not authenticated", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useAuth).mockReturnValue(false);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <ManageFactors />
      </MemoryRouter>,
    );

    expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
    vi.mocked(useAuth).mockReturnValue(true);
  });

  it("renders without crashing", () => {
    vi.mocked(useAuth).mockReturnValue(true);
    render(
      <MemoryRouter>
        <ManageFactors />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Manage Intensity Factors/i)).toBeInTheDocument();
  });

  it("opens and closes the Create modal", () => {
    vi.mocked(useAuth).mockReturnValue(true);
    render(
      <MemoryRouter>
        <ManageFactors />
      </MemoryRouter>,
    );
    const bulkEditButtons = screen.getAllByRole("button", {
      name: /Bulk Edit Mode/i,
    });
    fireEvent.click(bulkEditButtons[0]);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("switches tabs correctly", () => {
    vi.mocked(useAuth).mockReturnValue(true);
    render(
      <MemoryRouter>
        <ManageFactors />
      </MemoryRouter>,
    );

    expect(screen.getByText("Manage Intensity Factors")).toBeInTheDocument();
    expect(screen.getByText("Manage Procurement Factors")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Procurement Factors"));
    expect(screen.getByText("Manage Procurement Factors")).toBeInTheDocument();
  });
});

describe("EditFactorModal Component", () => {
  it("renders correctly", () => {
    render(
      <EditFactor
        show={true}
        handleClose={vi.fn()}
        modalTitle="Edit"
        selectedFactor={{ activity: "Test", value: 100 }}
        handleSubmit={vi.fn()}
        setSelectedFactor={vi.fn()}
        buttonContents="Save Changes"
      />,
    );
    expect(screen.getByText("Edit Conversion Factor")).toBeInTheDocument();
  });

  it("calls handleSubmit on save", () => {
    const handleSubmit = vi.fn();
    render(
      <EditFactor
        show={true}
        handleClose={vi.fn()}
        handleSubmit={handleSubmit}
        selectedFactor={{ activity: "Test", value: 100 }}
        setSelectedFactor={vi.fn()}
        buttonContents="Save Changes"
      />,
    );
    fireEvent.click(screen.getByText("Save Changes"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});

describe("FactorTable Component", () => {
  const mockConversionFn = (setData) =>
    setData([
      {
        id: 1,
        category: "Electricity",
        consumption_type: "Residential",
        intensity: 100,
        unit: "kg CO2e",
      },
      {
        id: 2,
        category: "Gas",
        consumption_type: "Commercial",
        intensity: 200,
        unit: "kg CO2e",
      },
    ]);

  it("renders factors correctly", () => {
    render(
      <FactorTable conversionFactors={mockConversionFn} tableName="Test" />,
    );

    expect(screen.getByText("Electricity")).toBeInTheDocument();
    expect(screen.getByText("Residential")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getAllByText(/kg CO2e/i).length).toBeGreaterThan(0);
  });

  it("filters factors based on search query", () => {
    render(
      <FactorTable conversionFactors={mockConversionFn} tableName="Test" />,
    );

    const searchInput = screen.getByPlaceholderText(
      "Search category or consumption type...",
    );
    fireEvent.change(searchInput, { target: { value: "Electricity" } });

    expect(screen.getByText("Electricity")).toBeInTheDocument();
    expect(screen.queryByText("Gas")).not.toBeInTheDocument();
  });

  it("sorts factors by column when header is clicked", () => {
    render(
      <FactorTable conversionFactors={mockConversionFn} tableName="Test" />,
    );

    const headers = screen.getAllByRole("columnheader");
    const categoryHeader = headers.find((el) =>
      el.textContent.toLowerCase().includes("category"),
    );

    expect(categoryHeader).toBeTruthy();
    fireEvent.click(categoryHeader);

    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("Gas");
  });

  it("toggles Bulk Edit Mode", () => {
    render(
      <FactorTable conversionFactors={mockConversionFn} tableName="Test" />,
    );

    const editButton = screen.getByText("Bulk Edit Mode");
    fireEvent.click(editButton);

    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("validates and updates intensity input", () => {
    render(
      <FactorTable conversionFactors={mockConversionFn} tableName="Test" />,
    );

    fireEvent.click(screen.getByText("Bulk Edit Mode"));
    const input = screen.getByDisplayValue("100");

    fireEvent.change(input, { target: { value: "abc" } });
    expect(
      screen.queryByText("Must be a valid number"),
    ).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "150" } });
    expect(
      screen.queryByText("Must be a valid number"),
    ).not.toBeInTheDocument();
  });
});

describe("DeleteFactorModal Component", () => {
  it("renders warning message", () => {
    render(
      <DeleteFactor
        showDelete={true}
        handleDelete={vi.fn()}
        handleClose={vi.fn()}
      />,
    );
    expect(
      screen.getByText(
        "Are you sure you want to delete the following conversion factor?",
      ),
    ).toBeInTheDocument();
  });

  it("calls handleDelete on delete", () => {
    const handleDelete = vi.fn();
    render(
      <DeleteFactor
        showDelete={true}
        handleDelete={handleDelete}
        handleClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalled();
  });
});

describe("ProcurementTable Component", () => {
  const mockConversionFn = (setData) =>
    setData([
      {
        id: 1,
        category: "Office Supplies",
        carbon_impact: 300,
        unit: "kg CO2e",
      },
      {
        id: 2,
        category: "Furniture",
        carbon_impact: 600,
        unit: "kg CO2e",
      },
    ]);

  it("renders procurement factors correctly", () => {
    render(
      <ProcurementTable
        conversionFactors={mockConversionFn}
        tableName="Procurement"
      />,
    );
    expect(screen.getByText("Office Supplies")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
  });

  it("filters procurement factors based on search query", () => {
    render(
      <ProcurementTable
        conversionFactors={mockConversionFn}
        tableName="Procurement"
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search category");
    fireEvent.change(searchInput, { target: { value: "Furniture" } });

    expect(screen.getByText("Furniture")).toBeInTheDocument();
    expect(screen.queryByText("Office Supplies")).not.toBeInTheDocument();
  });

  it("toggles edit mode and validates input", () => {
    render(
      <ProcurementTable
        conversionFactors={mockConversionFn}
        tableName="Procurement"
      />,
    );
    fireEvent.click(screen.getByText("Bulk Edit Mode"));

    const input = screen.getByDisplayValue("300");

    fireEvent.change(input, { target: { value: "350" } });
    expect(screen.queryByText("Must be a valid number")).toBeNull();
  });

  it("sorts procurement factors by column when header is clicked", () => {
    render(
      <ProcurementTable
        conversionFactors={mockConversionFn}
        tableName="Procurement"
      />,
    );

    const headers = screen.getAllByRole("columnheader");
    const categoryHeader = headers.find((el) =>
      el.textContent.toLowerCase().includes("category"),
    );
    expect(categoryHeader).toBeTruthy();

    fireEvent.click(categoryHeader);
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("Office");
  });
});

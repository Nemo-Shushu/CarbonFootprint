import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResultsDisplay from "../ResultsDisplay";

vi.mock("@mui/x-charts/PieChart", () => ({
  PieChart: () => <div data-testid="pie-chart">Pie Chart Mock</div>,
  pieArcLabelClasses: { root: "mocked-pieArcLabelClasses" },
}));

describe("ResultsDisplay Component", () => {
  it("renders total carbon emissions title", async () => {
    const mockCalculations = {
      total_carbon_emissions: 95426.8,
      total_electricity_emissions: 8467.08,
      total_gas_emissions: 123124,
      total_water_emissions: 329.59,
      total_travel_emissions: 45.1,
      total_waste_emissions: 75039.53,
      total_procurement_emissions: 24.18,
    };

    render(<ResultsDisplay calculations={mockCalculations} rawData={{}} />);

    await waitFor(() => {
      expect(screen.getByText(/Total Carbon Emissions/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Gas Emissions/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Water Emissions/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Travel Emissions/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Waste Emissions/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Total Procurement Emissions/i),
      ).toBeInTheDocument();
    });
  });

  it("renders PieChart", async () => {
    const mockCalculations = {
      total_carbon_emissions: 100,
    };

    render(<ResultsDisplay calculations={mockCalculations} rawData={{}} />);

    await waitFor(() => {
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
  });

  it("renders section titles for different data categories", async () => {
    const mockRawData = {
      Utilities: {
        "FTE-Staff": 100,
        "FTE-Members": 200,
      },
      Travel: {
        "Air-Eco-Short": 321,
        "Air-Business-Short": 231,
      },
      Waste: {
        "Mixed-Recycle": 321,
      },
      Procurement: {
        AA: 321,
      },
    };

    render(<ResultsDisplay calculations={{}} rawData={mockRawData} />);

    await waitFor(() => {
      expect(screen.getByText("Utilities")).toBeInTheDocument();
      expect(screen.getByText("Travel")).toBeInTheDocument();
      expect(screen.getByText("Waste")).toBeInTheDocument();
      expect(screen.getByText("Procurement")).toBeInTheDocument();
    });
  });
});

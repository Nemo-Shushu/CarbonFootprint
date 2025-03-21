// import { describe, it, expect, vi } from "vitest";
// import { MemoryRouter, useNavigate } from "react-router-dom";
// import { render, screen, fireEvent } from "@testing-library/react";
// import { useAuth } from "../useAuth";
// import ManageFactors from "../features/ManageFactors/components/ManageFactors";
// import EditFactor from "../features/ManageFactors/components/EditFactorModal";
// import FactorTable from "../features/ManageFactors/components/FactorTable";
// import DeleteFactor from "../features/ManageFactors/components/DeleteFactorModal";

// vi.mock("../features/ManageFactors/api/apiFactors", () => ({
//   getConversionFactors: vi.fn(),
//   handleUpdateSubmissionAPI: vi.fn(),
//   handleCreateSubmissionAPI: vi.fn(),
//   handleDeleteSubmissionAPI: vi.fn(),
// }));

// describe("ManageFactors Component", () => {
//   vi.mock("../useAuth", () => ({
//     useAuth: vi.fn(),
//   }));

//   vi.mock("react-router-dom", async () => {
//     const actual = await vi.importActual("react-router-dom");
//     return {
//       ...actual,
//       useNavigate: vi.fn(() => vi.fn()),
//     };
//   });

//   it("redirects to sign-in page if user is not authenticated", () => {
//     const mockNavigate = vi.fn();
//     vi.mocked(useAuth).mockReturnValue(false);
//     vi.mocked(useNavigate).mockReturnValue(mockNavigate);

//     render(
//       <MemoryRouter>
//         <ManageFactors />
//       </MemoryRouter>,
//     );

//     expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
//     vi.mocked(useAuth).mockReturnValue(true);
//   });

//   it("renders without crashing", () => {
//     render(
//       <MemoryRouter>
//         <ManageFactors />
//       </MemoryRouter>,
//     );
//     expect(screen.getByText("Manage Conversion Factors")).toBeInTheDocument();
//   });

//   it("opens and closes the Create modal", () => {
//     render(
//       <MemoryRouter>
//         <ManageFactors />
//       </MemoryRouter>,
//     );
//     const bulkEditButtons = screen.getAllByRole("button", {
//       name: /Bulk Edit Mode/i,
//     });
//     fireEvent.click(bulkEditButtons[0]);
//     expect(screen.getByText("Cancel")).toBeInTheDocument();
//   });

//   it("switches tabs correctly", () => {
//     render(
//       <MemoryRouter>
//         <ManageFactors />
//       </MemoryRouter>,
//     );

//     expect(screen.getByText("Manage Intensity Factors")).toBeInTheDocument();
//     expect(screen.getByText("Manage Procurement Factors")).toBeInTheDocument();
//     fireEvent.click(screen.getByText("Procurement Factors"));
//     expect(screen.getByText("Manage Procurement Factors")).toBeInTheDocument();
//     expect(screen.queryByText("Manage Intensity Factors")).toBeInTheDocument();
//   });
// });

// describe("EditFactorModal Component", () => {
//   it("renders correctly", () => {
//     render(
//       <EditFactor
//         show={true}
//         handleClose={vi.fn()}
//         modalTitle="Edit"
//         selectedFactor={{ activity: "Test", value: 100 }}
//         handleSubmit={vi.fn()}
//         setSelectedFactor={vi.fn()}
//         buttonContents="Save Changes"
//       />,
//     );
//     expect(screen.getByText("Edit Conversion Factor")).toBeInTheDocument();
//   });

//   it("calls handleSubmit on save", () => {
//     const handleSubmit = vi.fn();
//     render(
//       <EditFactor
//         show={true}
//         handleClose={vi.fn()}
//         handleSubmit={handleSubmit}
//         selectedFactor={{ activity: "Test", value: 100 }}
//         setSelectedFactor={vi.fn()}
//         buttonContents="Save Changes"
//       />,
//     );
//     fireEvent.click(screen.getByText("Save Changes"));
//     expect(handleSubmit).toHaveBeenCalled();
//   });
// });

// describe("FactorTable Component", () => {
//   it("renders factors correctly", () => {
//     vi.mock("../features/ManageFactors/api/apiFactors", () => ({
//       getConversionFactors: vi.fn((setEditedFactors) => {
//         setEditedFactors([
//           {
//             id: 1,
//             category: "Electricity",
//             consumption_type: "Residential",
//             intensity: 100,
//             unit: "kg CO2e",
//           },
//           {
//             id: 2,
//             category: "Gas",
//             consumption_type: "Commercial",
//             intensity: 200,
//             unit: "kg CO2e",
//           },
//         ]);
//       }),
//     }));
//     render(<FactorTable />);

//     expect(screen.getByText("Electricity")).toBeInTheDocument();
//     expect(screen.getByText("Residential")).toBeInTheDocument();
//     expect(screen.getByText("100")).toBeInTheDocument();
//     expect(screen.getAllByText(/kg CO2e/i).length).toBeGreaterThan(0);
//   });

//   it("filters factors based on search query", () => {
//     render(<FactorTable />);

//     const searchInput = screen.getByPlaceholderText(
//       "Search category or consumption type...",
//     );
//     fireEvent.change(searchInput, { target: { value: "Electricity" } });

//     expect(screen.getByText("Electricity")).toBeInTheDocument();
//     expect(screen.queryByText("Gas")).not.toBeInTheDocument();
//   });

//   it("sorts factors by column when header is clicked", () => {
//     render(<FactorTable />);

//     const categoryHeader = screen.getByText("category");
//     fireEvent.click(categoryHeader);
//     const firstRow = screen.getAllByRole("row")[1];
//     expect(firstRow).toHaveTextContent("Gas");
//   });

//   it("toggles Bulk Edit Mode", () => {
//     render(<FactorTable />);

//     const editButton = screen.getByText("Bulk Edit Mode");
//     fireEvent.click(editButton);

//     expect(screen.getByText("Save Changes")).toBeInTheDocument();
//   });

//   it("validates and updates intensity input", () => {
//     render(
//       <FactorTable
//         conversionFactors={[
//           {
//             id: 1,
//             category: "Electricity",
//             consumption_type: "Residential",
//             intensity: 100,
//             unit: "kg CO2e",
//           },
//         ]}
//       />,
//     );

//     fireEvent.click(screen.getByText("Bulk Edit Mode"));
//     const input = screen.getByDisplayValue("100");

//     fireEvent.change(input, { target: { value: "abc" } });
//     expect(
//       screen.queryByText("Must be a valid number"),
//     ).not.toBeInTheDocument();

//     fireEvent.change(input, { target: { value: "150" } });
//     expect(
//       screen.queryByText("Must be a valid number"),
//     ).not.toBeInTheDocument();
//   });
// });

// describe("DeleteFactorModal Component", () => {
//   it("renders warning message", () => {
//     render(
//       <DeleteFactor
//         showDelete={true}
//         handleDelete={vi.fn()}
//         handleClose={vi.fn()}
//       />,
//     );
//     expect(
//       screen.getByText(
//         "Are you sure you want to delete the following conversion factor?",
//       ),
//     ).toBeInTheDocument();
//   });

//   it("calls handleDelete on delete", () => {
//     const handleDelete = vi.fn();
//     render(
//       <DeleteFactor
//         showDelete={true}
//         handleDelete={handleDelete}
//         handleClose={vi.fn()}
//       />,
//     );
//     fireEvent.click(screen.getByText("Delete"));
//     expect(handleDelete).toHaveBeenCalled();
//   });
// });

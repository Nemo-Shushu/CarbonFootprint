import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getConversionFactors,
  handleBulkUpdateSubmissionAPI,
} from "../api/apiFactors.jsx"; // Assuming API functions are in this file
import "../assets/ManageFactors.css";

FactorTable.propTypes = {
  tableName: PropTypes.string,
  conversionFactors: PropTypes.array,
};

function FactorTable({ tableName, conversionFactors }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [editing, setEditing] = useState(false);
  const [editedFactors, setEditedFactors] = useState([]);

  // Initialize edited factors with existing data
  useEffect(() => {
    getConversionFactors(setEditedFactors);
  }, [conversionFactors]);

  // Handle search filter
  const filteredFactors = editedFactors.filter((factor) =>
    `${factor.category} ${factor.consumption_type}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Handle sorting
  const sortedFactors = [...filteredFactors].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (typeof valueA === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
  });

  // Toggle edit mode
  const toggleEditMode = () => setEditing(!editing);

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    setEditedFactors((prev) =>
      prev.map((factor) =>
        factor.id === id ? { ...factor, [field]: value } : factor,
      ),
    );
  };

  // Save all edited factors
  const handleBulkSave = async (event) => {
    await handleBulkUpdateSubmissionAPI(event, editedFactors);
    setEditing(false);
    getConversionFactors(setEditedFactors); // Refresh data after update
  };

  return (
    <div className="container-fluid">
      <div>
        <div className="row align-items-center">
          <div className="col-md-8 align-middle" style={{ paddingLeft: "0px" }}>
            <h2 className="text-start">Manage {tableName} Factors</h2>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="d-flex mb-2"></div>

      {/* Edit & Save Buttons */}
      <div className="d-flex my-3">
        <input
          type="text"
          className="form-control m-1 flex-grow-5"
          placeholder="Search category or consumption type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn btn-primary m-1 flex-grow-1 text-nowrap"
          onClick={toggleEditMode}
        >
          {editing ? "Cancel" : "Bulk Edit Mode"}
        </button>
        {editing && (
          <button
            className="btn btn-success m-1 flex-grow-1 text-nowrap"
            onClick={handleBulkSave}
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Table */}
      <table className="table table-hover">
        <thead>
          <tr className="align-middle text-start">
            {["category", "consumption_type", "intensity", "unit"].map(
              (field) => (
                <th
                  key={field}
                  scope="col"
                  onClick={() => {
                    setSortField(field);
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {field.replace("_", " ")}{" "}
                  {sortField === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {sortedFactors.map((factor) => (
            <tr className="align-middle text-start" key={factor.id}>
              <td>{factor.category}</td>
              <td>{factor.consumption_type}</td>
              <td>
                {editing ? (
                  <input
                    type="number"
                    className="form-control"
                    value={factor.intensity}
                    onChange={(e) =>
                      handleInputChange(factor.id, "intensity", e.target.value)
                    }
                  />
                ) : (
                  factor.intensity
                )}
              </td>
              <td>{factor.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FactorTable;

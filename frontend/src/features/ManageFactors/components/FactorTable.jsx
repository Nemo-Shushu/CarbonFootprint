import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { handleBulkUpdateSubmissionAPI } from "../api/apiFactors.jsx";
import "../assets/ManageFactors.css";

FactorTable.propTypes = {
  tableName: PropTypes.string,
  conversionFactors: PropTypes.func,
};

function FactorTable({ tableName, conversionFactors }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("category"); // Default sort by category
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
  const [editing, setEditing] = useState(false);
  const [editedFactors, setEditedFactors] = useState([]);
  const [originalFactors, setOriginalFactors] = useState([]); // Store original values for comparison
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (typeof conversionFactors === "function") {
      conversionFactors(setEditedFactors);
      conversionFactors(setOriginalFactors);
    }
  }, [setEditedFactors, setOriginalFactors]);
  

  const filteredFactors = editedFactors.filter((factor) =>
    `${factor.category} ${factor.consumption_type}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

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

  function toggleEditMode() {
    if (editing) {
      // If canceling edit mode, revert to original values
      setEditedFactors([...originalFactors]);
      setErrors({});
    }
    setEditing(!editing);
  }

  function handleInputChange(id, field, value) {
    if (field === "intensity") {
      // Allow only numbers and one decimal point
      if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) {
        return; // Reject non-numeric input
      }

      // Update the value in state
      setEditedFactors((prev) =>
        prev.map((factor) =>
          factor.id === id ? { ...factor, [field]: value } : factor,
        ),
      );

      // Validate and set errors
      if (value === "" || isNaN(parseFloat(value))) {
        setErrors((prev) => ({ ...prev, [id]: "Must be a valid number" }));
      } else {
        setErrors((prev) => {
          const updatedErrors = { ...prev };
          delete updatedErrors[id]; // Remove error if input is valid
          return updatedErrors;
        });
      }
    }
  }

  // Function to check if a factor has been modified
  function hasFactorChanged(editedFactor) {
    const originalFactor = originalFactors.find(
      (f) => f.id === editedFactor.id,
    );
    if (!originalFactor) return true; // New factor

    // Convert to same type before comparison (both as numbers)
    return Number(editedFactor.intensity) !== Number(originalFactor.intensity);
  }

  async function handleBulkSave(event) {
    if (Object.keys(errors).length > 0) {
      alert("Please correct the errors before saving.");
      return;
    }

    // Filter only changed factors
    const changedFactors = editedFactors
      .filter(hasFactorChanged)
      .map((factor) => ({
        ...factor,
        intensity: Number(factor.intensity),
      }));

    if (changedFactors.length === 0) {
      alert("No changes detected.");
      return;
    }

    await handleBulkUpdateSubmissionAPI(event, changedFactors);
    setEditing(false);

    // Refresh data after save
    await conversionFactors(setEditedFactors);
    setOriginalFactors(editedFactors);
  }

  return (
    <div className="container-fluid">
      <div>
        <div className="row align-items-center">
          <div className="col-md-8 align-middle" style={{ paddingLeft: "0px" }}>
            <h2 className="text-start">Manage {tableName} Factors</h2>
          </div>
        </div>
      </div>

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
            disabled={
              Object.keys(errors).length > 0 ||
              !editedFactors.some(hasFactorChanged)
            } // Disable when no changes
          >
            Save Changes
          </button>
        )}
      </div>

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
            <tr
              className={`align-middle text-start ${editing && hasFactorChanged(factor) ? "table-warning" : ""}`}
              key={factor.id}
            >
              <td>{factor.category}</td>
              <td>{factor.consumption_type}</td>
              <td>
                {editing ? (
                  <>
                    <input
                      type="text"
                      className={`form-control ${errors[factor.id] ? "is-invalid" : ""}`}
                      value={factor.intensity}
                      onChange={(e) =>
                        handleInputChange(
                          factor.id,
                          "intensity",
                          e.target.value,
                        )
                      }
                    />
                    {errors[factor.id] && (
                      <div className="invalid-feedback">
                        {errors[factor.id]}
                      </div>
                    )}
                  </>
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

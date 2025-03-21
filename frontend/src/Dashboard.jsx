import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";
import Profile from "./Profile";
import ResultsDisplay from "./ResultsDisplay";
import Sidebar from "./Sidebar";
import "./static/dashboard.css";
import "./static/RequestAdmin.css";
import "./static/Sidebar.css";
import PropTypes from "prop-types";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

TableComponent.propTypes = {
  isAdmin: PropTypes.bool,
  isResearcher: PropTypes.bool,
};

function TableComponent({ isAdmin, isResearcher }) {
  const [data, setData] = useState([]);
  const [repId, setRepId] = useState();
  const [report, setReport] = useState([]);
  const [visibleReport, setVisibleReport] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [fields, setFields] = useState([]);
  const [filter, setFilter] = useState({
    institute: "",
    research_field: "",
    own_reports: false,
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    if (repId !== null && repId !== undefined) {
      getSpecificReport();
    }
  }, [repId]);

  useEffect(() => {
    fetch(backendUrl.concat("api/institutions/"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fail to get an university lists.");
        }
        return response.json();
      })
      .then((data) => {
        setInstitutions(data);
      })
      .catch((err) => {
        console.error("Error fetching institutions:", err);
      });
  }, []);

  useEffect(() => {
    fetch(backendUrl.concat("api/fields/"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fail to get a field lists.");
        }
        return response.json();
      })
      .then((data) => {
        setFields(data);
      })
      .catch((err) => {
        console.error("Error fetching fields:", err);
      });
  }, []);

  async function getReports() {
    try {
      const body = {};

      const response = await fetch(
        `${backendUrl}api/dashboard-show-user-result-data/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Reports received:", responseData);
      setData(responseData);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  }

  async function getSpecificReport() {
    try {
      const response = await fetch(`${backendUrl}api/get-all-report-data/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify({
          report_id: repId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Report received:", responseData);
      setReport(responseData);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  }

  const handleInstitutionsChange = (event) => {
    const selectedInstitute = event.target.value;
    setFilter((prevFilter) => ({
      ...prevFilter,
      institute: selectedInstitute,
    }));
  };

  const handleFieldsChange = (event) => {
    const selectedField = event.target.value;
    setFilter((prevFilter) => ({
      ...prevFilter,
      research_field: selectedField,
    }));
  };

  const handleOwnReportsChange = (event) => {
    const isChecked = event.target.checked;
    setFilter((prevFilter) => ({
      ...prevFilter,
      own_reports: isChecked,
    }));
  };

  function handleSearchChange(event) {
    setSearchString(event.target.value);
  }

  function findString(val) {
    if (parseInt(searchString) == 0) return true;
    return val.toString().includes(searchString);
  }

  const filteredData = data.filter((row) => {
    return (
      findString(row.id) &&
      (filter.institute === "" || filter.institute === row.institution) &&
      (filter.research_field === "" || filter.research_field === row.field) &&
      (!filter.own_reports || row.own_report)
    );
  });

  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      key = "id";
      direction = "asc";
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  return (
    <main className="ms-sm-auto px-md-4">
      <Modal
        show={visibleReport}
        onHide={() => setVisibleReport(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Carbon Emissions Data for: Report #{repId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ResultsDisplay
            calculations={report.calculations_data}
            rawData={report.report_data}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={visibleFilter}
        onHide={() => setVisibleFilter(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Institution</label>
            <select
              name="institute"
              className="form-select"
              value={filter.institute}
              onChange={handleInstitutionsChange}
            >
              <option value="" disabled>
                Select an institution
              </option>
              {institutions.map((inst, index) => (
                <option key={index} value={inst.name}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Research Field</label>
            <select
              name="research_field"
              className="form-select"
              value={filter.research_field}
              onChange={handleFieldsChange}
            >
              <option value="" disabled>
                Select a Research Field
              </option>
              {fields.map((inst, index) => (
                <option key={index} value={inst.name}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="own-reports"
              checked={filter.own_reports}
              onChange={handleOwnReportsChange}
            />
            <label
              className="form-check-label"
              htmlFor="own-reports"
              style={{ userSelect: "none" }}
            >
              Show Only My Own Reports
            </label>
          </div>

          <button
            className="btn btn-moss"
            onClick={() =>
              setFilter({
                institute: "",
                research_field: "",
                own_reports: false,
              })
            }
          >
            Reset Filter
          </button>
        </Modal.Body>
      </Modal>
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="mb-0">Available Reports</h3>
        <div className="d-flex ms-auto">
          <input
            type="text"
            name="search"
            className="form-control form-control-sm me-2"
            placeholder="Search specific report ID"
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setVisibleFilter(true);
            }}
            title="Filter by Research Field and Academic Institution"
          >
            <i className="bi bi-funnel"></i>
          </button>
        </div>
      </div>
      <div className="table-responsive small">
        {Array.isArray(data) && filteredData.length > 0 ? (
          <table className="table table-striped table-hover table-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  #
                </th>
                <th
                  scope="col"
                  onClick={() => sortTable("institution")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Academic Institution
                  {sortConfig.key === "institution" &&
                    (sortConfig.direction === "asc" ? (
                      <i className="bi bi-sort-up"></i>
                    ) : (
                      <i className="bi bi-sort-down"></i>
                    ))}
                </th>
                <th
                  scope="col"
                  onClick={() => sortTable("field")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Research Field
                  {sortConfig.key === "field" &&
                    (sortConfig.direction === "asc" ? (
                      <i className="bi bi-sort-up"></i>
                    ) : (
                      <i className="bi bi-sort-down"></i>
                    ))}
                </th>
                <th
                  scope="col"
                  onClick={() => sortTable("emissions")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Total Emissions
                  {sortConfig.key === "emissions" &&
                    (sortConfig.direction === "asc" ? (
                      <i className="bi bi-sort-up"></i>
                    ) : (
                      <i className="bi bi-sort-down"></i>
                    ))}
                </th>
                {(isAdmin || isResearcher) && (
                  <th
                    scope="col"
                    onClick={() => sortTable("email")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Email
                    {sortConfig.key === "email" &&
                      (sortConfig.direction === "asc" ? (
                        <i className="bi bi-sort-up"></i>
                      ) : (
                        <i className="bi bi-sort-down"></i>
                      ))}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="align-middle"
                  onClick={() => {
                    setRepId(row.id);
                    setVisibleReport(true);
                  }}
                >
                  <th scope="row">{row.id}</th>
                  <td>{row.institution}</td>
                  <td>{row.field}</td>
                  <td>{row.emissions}</td>
                  {(isAdmin || isResearcher) && <td>{row.email}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            className="fs-2 d-flex justify-content-center align-items-center"
            style={{
              height: "300px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "gray",
            }}
          >
            {data.length > 0
              ? "No data available matching your filters or search parameters"
              : "No data available"}
          </div>
        )}
      </div>
    </main>
  );
}

function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [showProfile, setShowProfile] = useState(
    queryParams.get("showProfile") === "true",
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [isResearcher, setIsResearcher] = useState(false);

  function handleAdminStatusChange(adminStatus) {
    setIsAdmin(adminStatus);
  }

  function handleResearcherStatusChange(ResearcherStatus) {
    setIsResearcher(ResearcherStatus);
  }

  /**
   * Toggles the visibility of the Profile.
   */
  function toggleProfile() {
    setShowProfile((prev) => !prev);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Modal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Profile />
        </Modal.Body>
      </Modal>
      {/* SideBar */}
      <Sidebar
        style={{ flex: "0 0 17%" }}
        onAdminStatusChange={handleAdminStatusChange}
        onResearcherStatusChange={handleResearcherStatusChange}
      />

      {/* Main Content */}
      <main style={{ flex: "1", padding: "1rem", overflowY: "auto" }}>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-1 border-bottom">
          <h1 className="h2">{isAdmin ? "Admin Dashboard" : "Dashboard"}</h1>

          {/* Setting */}
          <div className="position-relative">
            <i
              className="bi bi-person-circle"
              alt="Profile"
              data-testid="profile-icon"
              style={{
                fontSize: "2.5rem",
                color: "#333",
                cursor: "pointer",
                marginRight: "-30px",
                padding: "5px",
                borderRadius: "100%",
              }}
              onClick={() => {
                toggleProfile();
              }}
            />

            <button
              className="dropdown-item"
              onClick={() => {
                toggleProfile();
              }}
              data-testid="profile-btn"
            >
              Profile
            </button>
          </div>
        </div>

        <TableComponent isAdmin={isAdmin} isResearcher={isResearcher} />
      </main>
    </div>
  );
}

export { Dashboard, TableComponent };

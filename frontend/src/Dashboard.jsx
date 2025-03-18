import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./static/dashboard.css";
import Sidebar from "./Sidebar";
import "./static/Sidebar.css";
import "./static/RequestAdmin.css";
import Profile from "./Profile";
import Cookies from "js-cookie";
import ResultsDisplay from "./ResultsDisplay";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

TableComponent.propTypes = {
  isAdmin: PropTypes.boolean,
};

function TableComponent({ isAdmin }) {
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
    fetch(backendUrl.concat("api2/institutions/"))
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
    fetch(backendUrl.concat("api2/fields/"))
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
      const response = await fetch(
        `${backendUrl}api2/dashboard-show-user-result-data/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
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
      const response = await fetch(`${backendUrl}api2/get-all-report-data/`, {
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
    setFilter((prevFilter) => ({ ...prevFilter, institute: selectedInstitute }));
  };

  const handleFieldsChange = (event) => {
    const selectedField = event.target.value;
    setFilter((prevFilter) => ({ ...prevFilter, research_field: selectedField }));
  };

  function handleSearchChange(event) {
    setSearchString(event.target.value);
  };

  function findString(val) {
    if (parseInt(searchString) == 0) return true;
    return val.toString().includes(searchString);
  }

  return (
    <main className="ms-sm-auto px-md-4">
      <Modal show={visibleReport} onHide={() => setVisibleReport(false)} centered size="lg">
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
      <Modal show={visibleFilter} onHide={() => setVisibleFilter(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Filter Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdown for Academic Institution, not searchable at the moment  */}
          <div className="input-group">
            <select
              name="institute"
              className="input-field"
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

          {/* Dropdown for Research Field, need to be updated */}
          <div className="input-group">
            <select
              name="research_field"
              className="input-field"
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

          <button onClick={() => setFilter({ institute: "", research_field: "" })}>
            Reset Filter
          </button>
        </Modal.Body>
      </Modal>
      <div className="d-flex">
        <h3>Available Reports</h3>
        <input
          type="text"
          name="search"
          className="input-field"
          placeholder="Search a specific report ID"
          onChange={handleSearchChange}
        />
        <button
          className=""
          onClick={() => {
            setVisibleFilter(true);
          }}
          >
          Funnel symbol
        </button>
      </div>
      <div className="table-responsive small">
        {Array.isArray(data) && data.length > 0 ? (
          <table className="table table-striped table-hover table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Academic Institution</th>
                <th scope="col">Research Field</th>
                <th scope="col">Total Emissions</th>
                {isAdmin && <th scope="col">Email</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                findString(row.id) && 
                (filter.institute === "" || filter.institute === row.institution) &&
                (filter.research_field === "" || filter.research_field === row.field) && 
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
                  {isAdmin && <td>{row.email}</td>}
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
            No data available
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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  function handleAdminStatusChange(adminStatus) {
    setIsAdmin(adminStatus);
  }

  /**
   * Toggles the visibility of the Profile.
   */
  function toggleProfile() {
    setShowProfile((prev) => !prev);
    setShowDropdown(false);
  }

  /**
   * Toggles the visibility of the DropDown.
   */
  function toggleDropdown(event) {
    event.stopPropagation();
    setShowDropdown((prev) => !prev);
  }

  /**
   * Closes the Profile & Dropdown when clicking outside of it.
   */
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{ display: "flex", height: "100vh" }}
      onClick={handleClickOutside}
    >
      {/* SideBar */}
      <Sidebar
        style={{ flex: "0 0 17%" }}
        onAdminStatusChange={handleAdminStatusChange}
      />

      {/* Main Content */}
      <main style={{ flex: "1", padding: "1rem", overflowY: "auto" }}>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2">{isAdmin ? "Admin Dashboard" : "Dashboard"}</h1>

          {/* Setting */}
          <div className="position-relative" ref={dropdownRef}>
            <i
              className="bi bi-person-circle h2"
              alt="Settings"
              data-testid="profile-icon"
              style={{ width: "30px", cursor: "pointer" }}
              onClick={toggleDropdown}
            ></i>

            {/* Dropdown */}
            {showDropdown && (
              <ul className="dropdown-menu show position-absolute end-0">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      toggleProfile();
                      setShowDropdown(false);
                    }}
                    data-testid="profile-btn"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={""}
                    data-testid="setting-btn"
                  >
                    Settings
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Profile */}
        {showProfile && (
          <div ref={profileRef}>
            <Profile />
          </div>
        )}

        <TableComponent isAdmin={isAdmin} />
      </main>
    </div>
  );
}

export { Dashboard, TableComponent };

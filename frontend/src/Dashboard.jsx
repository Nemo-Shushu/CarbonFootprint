import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
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

const csrftoken = Cookies.get("csrftoken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function TableComponent() {
  const [data, setData] = useState([]);
  const [repId, setRepId] = useState();
  const [report, setReport] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    if (repId !== null && repId !== undefined) {
      getSpecificReport();
    }
  }, [repId]);

  async function getReports() {
    try {
      const response = await fetch(
        `${backendUrl}api2/dashboard_show_user_result_data/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
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
      const response = await fetch(`${backendUrl}api2/get_all_report_data/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
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

  return (
    <main className="ms-sm-auto px-md-4">
      <Modal show={visible} onHide={() => setVisible(false)} centered size="lg">
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
      <h2>Available Reports</h2>
      <div className="table-responsive small">
        <table className="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Academic Institution</th>
              <th scope="col">Research Field</th>
              <th scope="col">Total Emissions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="align-middle"
                onClick={() => {
                  setRepId(row.id);
                  setVisible(true);
                }}
              >
                <th scope="row">{row.id}</th>
                <td>{row.institution}</td>
                <td>{row.field}</td>
                <td>{row.emissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

// Admin Dashboard Page
function AdminTableComponent() {
  const [data, setData] = useState([]);
  const [repId, setRepId] = useState();
  const [report, setReport] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    if (repId !== null && repId !== undefined) {
      getSpecificReport();
    }
  }, [repId]);

  async function getReports() {
    try {
      const response = await fetch(
        `${backendUrl}api2/dashboard_show_user_result_data/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
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
      const response = await fetch(`${backendUrl}api2/get_all_report_data/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
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

  return (
    <main className="ms-sm-auto px-md-4">
      <Modal show={visible} onHide={() => setVisible(false)} centered size="lg">
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
      <h2>Available Reports</h2>
      <div className="table-responsive small">
        <table className="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Academic Institution</th>
              <th scope="col">Research Field</th>
              <th scope="col">Total Emissions</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="align-middle"
                onClick={() => {
                  setRepId(row.id);
                  setVisible(true);
                }}
              >
                <th scope="row">{row.id}</th>
                <td>{row.institution}</td>
                <td>{row.field}</td>
                <td>{row.emissions}</td>
                <td>{row.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Dashboard() {
  const navigate = useNavigate();
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

  function handleProtect() {
    navigate("/sign-in");
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

  return useAuth() ? (
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
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={""}>
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

        {isAdmin ? <AdminTableComponent /> : <TableComponent />}
      </main>
    </div>
  ) : (
    handleProtect()
  );
}

export { Dashboard, TableComponent };

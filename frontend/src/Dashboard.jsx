import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom";
import Profile from "./Profile";
import ResultsDisplay from "./ResultsDisplay";
import Sidebar from "./Sidebar";
import "./static/dashboard.css";
import "./static/RequestAdmin.css";
import "./static/Sidebar.css";

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
        `${backendUrl}api/dashboard_show_user_result_data/`,
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
      const response = await fetch(`${backendUrl}api/get_all_report_data/`, {
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
      <h3>Available Reports</h3>
      <div className="table-responsive small">
        {Array.isArray(data) && data.length > 0 ? (
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
        `${backendUrl}api/dashboard_show_user_result_data/`,
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
      const response = await fetch(`${backendUrl}api/get_all_report_data/`, {
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
        {Array.isArray(data) && data.length > 0 ? (
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
  }

  /**
   * Toggles the visibility of the DropDown.
   */
  function toggleDropdown(event) {
    event.stopPropagation();
  }

  /**
   * Closes the Profile & Dropdown when clicking outside of it.
   */
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // setShowDropdown(false);
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
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-1 border-bottom">
          <h1 className="h2">{isAdmin ? "Admin Dashboard" : "Dashboard"}</h1>

          {/* Setting */}
          <div className="position-relative" ref={dropdownRef}>
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
              onClick={toggleDropdown}
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

        {/* Profile */}
        {showProfile && (
          <div ref={profileRef}>
            <Profile />
          </div>
        )}

        {isAdmin ? <AdminTableComponent /> : <TableComponent />}
      </main>
    </div>
  );
}

export { Dashboard, TableComponent };

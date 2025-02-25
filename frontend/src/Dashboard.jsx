import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
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

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [showProfile, setShowProfile] = useState(
    queryParams.get("showProfile") === "true",
  );

  function handleProtect() {
    navigate("/sign-in");
  }

  /**
   * Toggles the visibility of the Profile by updating the URL parameters.
   * - If `showProfile=true` is already present in the URL, it removes it (hides the profile).
   * - If `showProfile!=true`, it adds it to the URL (shows the profile).
   * - This ensures that the URL changes, triggering a re-render and state update.
   */
  function toggleProfile() {
    // Create an object to manage URL query parameters
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("showProfile") === "true") {
      queryParams.delete("showProfile");
    } else {
      queryParams.set("showProfile", "true");
    }
    // Navigate to the updated URL to reflect the profile visibility state
    navigate(`?${queryParams.toString()}`);
  }

  /**
   * Closes the Profile component when clicking outside of it.
   * - Checks if the click event occurred outside the `.profile-container`.
   * - If the Profile is currently visible, it updates the URL to remove `showProfile`.
   * - This ensures that the Profile hides properly and the URL state is synchronized.
   */
  function closeProfile(event) {
    if (!event.target.closest(".profile-container") && showProfile) {
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete("showProfile");
      // Update the URL without adding a new history entry
      navigate(`?${queryParams.toString()}`, { replace: true });
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setShowProfile(queryParams.get("showProfile") === "true");
  }, [location.search]);

  return useAuth() ? (
    <div style={{ display: "flex", height: "100vh" }} onClick={closeProfile}>
      <Sidebar style={{ flex: "0 0 17%" }} onNameClick={toggleProfile} />
      <main style={{ flex: "1", padding: "1rem", overflowY: "auto" }}>
        <div className="d-flex flex-column">
          {showProfile && (
            <div className="profile-container">
              <Profile />
            </div>
          )}
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>
        </div>
        <TableComponent />
      </main>
    </div>
  ) : (
    handleProtect()
  );
}

export { Dashboard, TableComponent };

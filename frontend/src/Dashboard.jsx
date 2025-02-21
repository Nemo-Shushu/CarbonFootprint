import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from './useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/dashboard.css";
import Sidebar from './Sidebar';
import "./static/Sidebar.css";
import "./static/RequestAdmin.css"
import Profile from './Profile';

function TableComponent() {
    const data = [
        { id: 1001, institution: "University of Glasgow", field: "Computing Science", emissions: Math.floor(Math.random() * 1000), },
        { id: 1002, institution: "University of Oxford", field: "Physics", emissions: Math.floor(Math.random() * 1000), },
        { id: 1003, institution: "University of Cambridge", field: "Biology", emissions: Math.floor(Math.random() * 1000), },
        { id: 1004, institution: "Imperial College London", field: "Computer Science", emissions: Math.floor(Math.random() * 1000), },
        { id: 1005, institution: "University of Edinburgh", field: "Mathematics", emissions: Math.floor(Math.random() * 1000), },
        { id: 1006, institution: "University of Manchester", field: "Engineering", emissions: Math.floor(Math.random() * 1000), },
      ];

    const [data_api, setData] = useState([]);

    useEffect(() => {
        // http://localhost:8080/api/users/reports should return a json in format above with all available data to the user
        fetch("http://localhost:8000/api/users/reports")
          .then((response) => response.json())
          .then((json) => setData(json))
          .catch((error) => console.error("Error fetching data:", error));
      }, []);

    return (
        <main className="ms-sm-auto px-md-4">

            <h2>Available Reports</h2>
            <div className="table-responsive small">
                <table className="table table-striped table-sm">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Academic Institution</th>
                    <th scope="col">Research Field</th>
                    <th scope="col">Total Emissions</th>
                    <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="align-middle">
                    <th scope="row">{row.id}</th>
                    <td>{row.institution}</td>
                    <td>{row.field}</td>
                    <td>{row.emissions}</td>
                    <td><button className="btn btn-outline-secondary w-30" type="button">View & Edit</button></td>
                    </tr>
                ))}
                </tbody>
                </table>
            </div>
        </main>
    );
};

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [showProfile, setShowProfile] = useState(queryParams.get("showProfile") === "true");

    function handleProtect() {
        navigate("/sign-in")
    };
    
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
    };

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
    };
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setShowProfile(queryParams.get("showProfile") === "true");
    }, [location.search]);

      return useAuth() ? (
        <div style={{ display: "flex", height: "100vh" }} onClick={closeProfile} >
            <Sidebar style={{ flex: "0 0 17%",}} onNameClick={toggleProfile}/>
            <main style={{ flex: "1", padding: "1rem", overflowY: "auto",}} >
                <div className="d-flex flex-column">
                    {showProfile && <div className="profile-container"><Profile /></div>}
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
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/dashboard.css";
import Sidebar from './Sidebar';
import "./static/Sidebar.css";

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
        <main class="ms-sm-auto px-md-4">
            <h2>Available Reports</h2>
            <div class="table-responsive small">
                <table class="table table-striped table-sm">
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
    return (    
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 20%", backgroundColor: "#385A4F" }} />
            <main style={{ flex: "1", padding: "1rem", maxWidth: "80%" }}>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <h1 className="h2">Dashboard</h1>
                </div>
                <TableComponent />
            </main>
        </div>
    );
}

export { Dashboard, TableComponent };
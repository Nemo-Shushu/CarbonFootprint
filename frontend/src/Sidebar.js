import React, { useState } from "react";
import "./static/Sidebar.css";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {

  const [activeItem, setActiveItem] = useState("Dashboard");

  const navigate = useNavigate(); 

    const handleLogout = () => {
        localStorage.removeItem("userToken"); 
        navigate("/sign-in");
    };

  return (
    <div className="sidebar">
      <div className="user-info">
      <div className="user-name">
        <span>JOHN</span>
        <img src="/images/logout.png" alt="Logout Icon" className="icon logout" 
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
      </div>
        <p className="email">2134567@student.gla.ac.uk</p>
        <button className="new-report-btn">+ New Report</button>
      </div>
      <nav className="menu">
      <ul>
          <li
            className={`menu-item ${activeItem === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveItem("Dashboard")}
          >
            <span className="icon"><img src="/images/Dashboard.png" alt="Dashboard Icon" /></span> Dashboard
          </li>
          <li
            className={`menu-item ${activeItem === "Request Admin" ? "active" : ""}`}
            onClick={() => setActiveItem("Request Admin")}
          >
            <span className="icon request-admin"><img src="/images/RequestAdmin.png" alt="Request Admin Icon" /></span> Request Admin
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

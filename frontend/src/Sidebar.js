import React, { useState } from "react";
import "./static/Sidebar.css";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {

  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrf, setCsrf] = useState();
  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setActiveItem("Dashboard");
    } else if (location.pathname === "/request-admin") {
      setActiveItem("Request Admin");
    }
    getSession();
  }, [location.pathname]); 

  function getCSRF() {
    fetch("http://localhost:8000/api2/csrf/", {
      credentials: "include",
    })
    .then((res) => {
      let csrfToken = res.headers.get("X-CSRFToken");
      setCsrf(csrfToken);
      console.log(csrfToken);
    })
    .catch((err) => {
      console.log(err);
    });
}

  function getSession() {
    fetch("http://localhost:8000/api2/session/", {
        credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        getCSRF();
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

    const handleLogout = () => {
      localStorage.removeItem("userToken"); 
      fetch("http://localhost:8000/api2/logout/", {
        credentials: "include",
      })
      .catch((err) => {
        console.log(err);
      });
      navigate("/sign-in");
    };

    const getName = () => {
      localStorage.removeItem("userToken"); 
      fetch("http://localhost:8000/api2/whoami/", {
        credentials: "include",
      })
      .then((res) => {

      }
      )
      .catch((err) => {
        console.log(err);
      });
      navigate("/sign-in");
    };

    const handleDashboard = () => {
      navigate("/dashboard")
    };

    const handleRequestAdmin = () => {
      navigate("/request-admin")
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
        <Link to="/calculator">
          <button className="new-report-btn">+ New Report</button>
        </Link>
      </div>
      <nav className="menu">
      <ul>
          <li
            className={`menu-item ${activeItem === "Dashboard" ? "active" : ""}`}
            onClick={handleDashboard}
          >
            <span className="icon"><img src="/images/Dashboard.png" alt="Dashboard Icon" /></span> Dashboard
          </li>
          <li
            className={`menu-item ${activeItem === "Request Admin" ? "active" : ""}`}
            onClick={handleRequestAdmin}
          >
            <span className="icon request-admin"><img src="/images/RequestAdmin.png" alt="Request Admin Icon" /></span> Request Admin
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

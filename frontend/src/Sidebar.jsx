import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import './scss/custom.scss';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Sidebar = () => {

  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrf, setCsrf] = useState();
  const [username, setUserName] = useState();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();

  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setActiveItem("Dashboard");
    } else if (location.pathname === "/request-admin") {
      setActiveItem("Request Admin");
    } else if (location.pathname === "/calculator") {
      setActiveItem("");
    }
    getSession();
    getName();
  }, [location.pathname]); 

  function getCSRF() {
    fetch(backendUrl.concat("api2/csrf/"), {
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
    fetch(backendUrl.concat("api2/session/"), {
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
      fetch(backendUrl.concat("api2/logout"), {
        credentials: "include",
      })
      .then(isResponseOk)
      .then((data) => {
          console.log(data);
          setIsAuthenticated(false);
          getCSRF();
          navigate("/sign-in");
      })
      .catch((err) => {
          console.log(err);
      });
    };

    const getName = () => {
      localStorage.removeItem("userToken"); 
      fetch(backendUrl.concat("api2/whoami/"), {
        credentials: "include",
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserName(data.username);
        setFirstName(data.forename);
        setEmail(data.email);
      })
      .catch((err) => {
        console.log(err);
      });
    };

    const handleDashboard = () => {
      navigate("/dashboard")
    };

    const handleCalculator = () => {
      navigate("/calculator")
    };

    const handleRequestAdmin = () => {
      navigate("/request-admin")
    };

  return (
    <div className="bg-moss text-white d-flex flex-column pt-3 align-items-center" style={{width: 15 + 'rem', maxWidth: 20 + 'rem'}}>
      <div className="m-2">
      <div className="d-flex align-items-center gap-5 fw-bold fs-3 text-white mb-2">
        <span>{firstName}</span>
        <img src="/images/logout.png" alt="Logout Icon" onClick={handleLogout} style={{width: 25 + 'px', objectFit: 'contain', cursor: "pointer"}}/>
      </div>
        <p className="fs-6 align-items-center text-white-50" style={{overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 170 + 'px'}}>{email}</p>
        <button className="btn btn-light text-moss fw-bold text-align-center fs-6 p-2 m-2" style={{width: 90 + '%'}} onClick={handleCalculator}>+ New Report</button>
        <nav className="w-100">
          <div className={`btn btn-moss d-flex text-align-center text-white fs-6 p-2 m-2 my-3 ${activeItem === "Dashboard" ? "active" : ""}`} onClick={handleDashboard} style={{cursor: "pointer", width: 90 + '%'}}>
            <img src="/images/Dashboard.png" alt="Dashboard Icon" style={{width: 20 + 'px', objectFit: 'contain', marginRight: 10 + 'px', marginLeft: '5' + 'px'}}/> Dashboard
          </div>
          <div className={`btn btn-moss d-flex text-align-center text-white fs-6 p-2 m-2 ${activeItem === "Request Admin" ? "active" : ""}`} onClick={handleRequestAdmin} style={{cursor: "pointer", width: 90 + '%'}}>
            <img src="/images/RequestAdmin.png" alt="Request Admin Icon" style={{width: 16 + 'px', objectFit: 'contain', marginRight: 10 + 'px', marginLeft: '5' + 'px'}}/> Request Admin
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

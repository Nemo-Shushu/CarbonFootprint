import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import './scss/custom.scss';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Sidebar({ onNameClick }) {

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
    } else if (location.pathname === "/Manage-factors") {
      setActiveItem("Manage Factors");
    } else {
      setActiveItem("");
    }
    getSession();
    getName();
  }, [location.pathname]); 

  function getCSRF() {
    fetch(backendUrl + "api2/csrf/", {
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
    fetch(backendUrl + "api2/session/", {
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

  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
  }

  function handleLogout() {
    localStorage.removeItem("userToken"); 
    fetch(backendUrl + "api2/logout", {
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

  function getName() {
    localStorage.removeItem("userToken"); 
    fetch(backendUrl + "api2/whoami/", {
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

  function handleDashboard() {
    navigate("/dashboard")
  };

  function handleCalculator() {
    navigate("/calculator")
  };

  function handleRequestAdmin() {
    navigate("/request-admin")
  };

  function handleManageFactors() {
    navigate("/manage-factors")
  };

  return (
    <div className="bg-moss text-white d-flex flex-column pt-3 align-items-center" style={{width: 15 + 'rem', maxWidth: 20 + 'rem'}}>
      <div className="m-2">
      <div className="d-flex align-items-center gap-5 fw-bold fs-3 text-white mb-2">
        <span style={{ cursor: 'pointer' }} onClick={onNameClick} >{firstName} </span>
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
          <div className={`btn btn-moss d-flex text-center text-white fs-6 p-2 m-2 ${activeItem === "Manage Factors" ? "active" : ""}`} onClick={handleManageFactors} style={{cursor: "pointer", width: 90 + '%'}}>
            <div className="p-1 text-center">
              <i className="bi bi-database-fill-gear align-middle" style={{fontSize: "18px"}}></i>
            </div>
            <div>
              <p className="mb-0 ms-2 text-start">Manage Conversion Factors</p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

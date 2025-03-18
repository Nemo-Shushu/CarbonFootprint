import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./scss/custom.scss";
import { useAuth } from "./useAuth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

Sidebar.propTypes = {
  onAdminStatusChange: PropTypes.func,
};

function Sidebar({ onAdminStatusChange }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { isAuthenticated, loading } = useAuth();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();
  const [isAdmin, setIsAdmin] = useState(true); //isAdmin Status

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setActiveItem("Dashboard");
    } else if (location.pathname === "/request-admin") {
      setActiveItem("Request Admin");
    } else if (location.pathname === "/manage-factors") {
      setActiveItem("Manage Factors");
    } else if (location.pathname === "/admin-tool") {
      setActiveItem("AdminTool");
    } else {
      setActiveItem("");
    }
    getName();
  }, [location.pathname]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        handleProtect();
      }
    }
  }, [isAuthenticated, loading]);

  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  function handleLogout() {
    fetch(backendUrl + "api2/logout", {
      credentials: "include",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getName() {
    fetch(backendUrl + "api2/whoami/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFirstName(data.forename);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        onAdminStatusChange(data.isAdmin);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDashboard() {
    navigate("/dashboard");
  }

  function handleCalculator() {
    navigate("/calculator");
  }

  function handleRequestAdmin() {
    navigate("/request-admin");
  }

  function handleManageFactors() {
    navigate("/manage-factors");
  }

  function handleAdminTool() {
    navigate("/admin-tool");
  }

  const handleProtect = () => {
    navigate("/sign-in");
  };

  return (
    <div
      className="bg-moss text-white d-flex flex-column pt-3 align-items-center"
      style={{
        width: 15 + "rem",
        maxWidth: 20 + "rem",
        height: "100vh",
        background: "#234e39",
        position: "relative",
      }}
    >
      <div>
        <div className="d-flex align-items-center gap-5 fw-bold fs-3 text-white mb-2">
          <span style={{ cursor: "pointer", paddingLeft: "40px" }}>
            {firstName}{" "}
          </span>
          <img
            src="/images/logout.png"
            alt="Logout Icon"
            onClick={handleLogout}
            style={{
              width: 25 + "px",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </div>
        <p
          className="fs-6 align-items-center text-white-50"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 200 + "px",
            paddingLeft: "20px",
          }}
        >
          {email}
        </p>
        <button
          className={`btn btn-moss d-flex text-align-center text-white fs-6 p-1 my-3 ${activeItem === "New Report" ? "active" : ""}`}
          style={{ width: "100%", margin: "0", borderRadius: "0" }}
          onClick={handleCalculator}
        >
          <div
            style={{ width: "24px", display: "flex", justifyContent: "center" }}
          >
            <i
              className="bi bi-file-earmark-plus"
              style={{ fontSize: "20px" }}
            ></i>
          </div>
          <span style={{ marginLeft: "9px" }}>New Report</span>
        </button>

        <nav className="w-100">
          {/* Dashboard Button */}
          <div
            className={`btn btn-moss d-flex text-align-center text-white fs-6 p-1 my-3 ${activeItem === "Dashboard" ? "active" : ""}`}
            onClick={handleDashboard}
            style={{
              cursor: "pointer",
              width: 100 + "%",
              borderRadius: "0",
              margin: "10px 0 0 0",
            }}
          >
            <img
              src="/images/Dashboard.png"
              alt="Dashboard Icon"
              style={{
                width: 20 + "px",
                objectFit: "contain",
                marginRight: 10 + "px",
                marginLeft: "5" + "px",
                paddingleft: "10px",
              }}
            />{" "}
            Dashboard
          </div>

          {isAdmin ? (
            <>
              {/* Admin Tool Button */}
              <div
                className={`btn btn-moss d-flex text-align-center text-white fs-6 p-1 ${
                  activeItem === "AdminTool" ? "active" : ""
                }`}
                onClick={handleAdminTool}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "0",
                  margin: "10px 0 0 0",
                }}
              >
                <img
                  src="/images/RequestAdmin.png"
                  alt="AdminTool Icon"
                  style={{
                    width: 20 + "px",
                    objectFit: "contain",
                    marginRight: 10 + "px",
                    marginLeft: "5" + "px",
                    paddingleft: "10px",
                  }}
                />
                Admin Tool
              </div>

              {/* Manage Factors Button */}
              <div
                className={`btn btn-moss d-flex text-center text-white fs-6 p-2 ${
                  activeItem === "Manage Factors" ? "active" : ""
                }`}
                onClick={handleManageFactors}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "0",
                  margin: "10px 0 0 0",
                }}
              >
                <div className="p-1 text-center">
                  <i
                    className="bi bi-database-fill-gear align-middle"
                    style={{
                      fontSize: "20px",
                      marginLeft: "-2px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  ></i>
                </div>
                <div>
                  <p className="mb-0 ms-2 text-start">
                    Manage Conversion Factors
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Request Admin Button */}
              <div
                className={`btn btn-moss d-flex text-align-center text-white fs-6 p-2 m-2 ${
                  activeItem === "Request Admin" ? "active" : ""
                }`}
                onClick={handleRequestAdmin}
                style={{ cursor: "pointer", width: "90%" }}
              >
                <img
                  src="/images/RequestAdmin.png"
                  alt="Request Admin Icon"
                  style={{
                    width: 20 + "px",
                    objectFit: "contain",
                    marginRight: 10 + "px",
                    marginLeft: "5" + "px",
                    paddingleft: "10px",
                  }}
                />
                Request Admin
              </div>
            </>
          )}
        </nav>
      </div>
      {/* University of Glasgow Logo*/}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <img
          src="/images/UniLogo.png"
          alt="University of Glasgow"
          style={{
            width: "150px",
            height: "auto",
            marginBottom: "15px",
          }}
        />
        {/* Social Media Icons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <a
            href="https://www.facebook.com/UofGlasgow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="bi bi-facebook"
              style={{ fontSize: "20px", color: "#ffffff" }}
            ></i>
          </a>
          <a
            href="https://twitter.com/UofGlasgow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="bi bi-twitter-x"
              style={{ fontSize: "20px", color: "#ffffff" }}
            ></i>
          </a>
          <a
            href="https://www.instagram.com/UofGlasgow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="bi bi-instagram"
              style={{ fontSize: "20px", color: "#ffffff" }}
            ></i>
          </a>
          <a
            href="https://www.gla.ac.uk/research/az/sustainablesolutions/ourprojects/carbonfootprinttool/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="bi bi-house-door"
              style={{ fontSize: "20px", color: "#ffffff" }}
            ></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

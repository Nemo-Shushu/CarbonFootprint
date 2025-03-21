import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import PropTypes from "prop-types";
import "./scss/custom.scss";
import "./static/RequestAdmin.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

Sidebar.propTypes = {
  onAdminStatusChange: PropTypes.func,
  onResearcherStatusChange: PropTypes.func,
};

function Sidebar({ onAdminStatusChange, onResearcherStatusChange }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const { isAuthenticated, loading } = useAuth();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();
  const [isAdmin, setIsAdmin] = useState(false); //isAdmin Status
  const [isResearcher, setIsResearcher] = useState(false);
  const [csrf, setCsrf] = useState();
  const [requestStatus, setRequestStatus] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [adminRequest, setAdminRequest] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  function handleShow() {
    getRequestStatus();
    console.log("handling show");
    console.log(requestStatus);
    setShow(true);
  }

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
    if (!loading && !isAuthenticated) {
      handleProtect();
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    setCsrf(Cookies.get("csrftoken"));
  });

  const handleRequestRole = (event) => {
    const role = event.target.value;
    setAdminRequest((adminRequest) => ({
      ...adminRequest,
      requested_role: role,
    }));
  };

  const handleRequestReason = (event) => {
    const reason = event.target.value;
    setAdminRequest((adminRequest) => ({ ...adminRequest, reason: reason }));
  };

  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  async function handleAdminRequest() {
    await fetch(`${backendUrl}api/submit-adminrequest/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrf,
      },
      body: JSON.stringify(adminRequest),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update conversion factors");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Submitted request:", data);
      })
      .catch((err) => {
        console.error("Failed to send request", err);
      });
    setShow(false);
  }

  async function getRequestStatus() {
    await fetch(`${backendUrl}api/user-request-status/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrf,
      },
    })
      .then((response) => {
        if (!response.ok) {
          setRequestStatus({ success: false });
          throw new Error("Failed to retrieve request status");
        }
        return response.json();
      })
      .then((data) => {
        setRequestStatus(data);
        console.log("Submitted request:", data);
      })
      .catch((err) => {
        console.error("Failed to send request", err);
      });
  }

  function handleLogout() {
    fetch(`${backendUrl}api/logout`, {
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
    fetch(`${backendUrl}api/whoami/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFirstName(data.forename);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        onAdminStatusChange(data.isAdmin);
        setIsResearcher(data.isResearcher);
        onResearcherStatusChange(data.isResearcher);
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
      className="bg-moss text-white flex-column pt-3"
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
          <span style={{ cursor: "pointer", paddingLeft: "15px" }}>
            {firstName}{" "}
          </span>
          <img
            src="/images/logout.png"
            alt="Logout Icon"
            onClick={handleLogout}
            style={{
              width: "25px",
              marginLeft: "-25px",
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
          style={{
            width: "100%",
            margin: "0",
            borderRadius: "20",
            height: "35px",
          }}
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
          <div
            className={`btn btn-moss d-flex text-align-center text-white fs-6 p-1 my-3 ${activeItem === "Dashboard" ? "active" : ""}`}
            onClick={handleDashboard}
            style={{
              cursor: "pointer",
              width: 100 + "%",
              height: "35px",
              borderRadius: "20",
              margin: "10px 0 0 0",
            }}
          >
            <img
              src="/images/Dashboard.png"
              alt="Dashboard Icon"
              style={{
                width: "20px",
                objectFit: "contain",
                marginRight: 10 + "px",
                marginLeft: "5" + "px",
                marginBottom: "3px",
              }}
            />
            Dashboard
          </div>
          {isAdmin ? (
            <>
              <div
                className={`btn btn-moss d-flex text-align-center text-white fs-6 p-1 ${
                  activeItem === "AdminTool" ? "active" : ""
                }`}
                onClick={handleAdminTool}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "20",
                  height: "35px",
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
              <div
                className={`btn btn-moss d-flex text-center text-white fs-6 p-2 ${
                  activeItem === "Manage Factors" ? "active" : ""
                }`}
                onClick={handleManageFactors}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "20",
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
              <div
                className={`btn btn-moss d-flex text-align-center text-white fs-6 p-1 ${
                  activeItem === "Request Admin" ? "active" : ""
                }`}
                onClick={handleShow}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  borderRadius: "20",
                  height: "35px",
                  margin: "10px 0 0 0",
                }}
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
          left: "47%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <img
          src="/images/UoG_keyline.png"
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

      <>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Request Admin Access</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {requestStatus.success ? (
              requestStatus.status === "Rejected" ? (
                <>
                  Unfortunately your request to become an{" "}
                  {requestStatus.requested_role} was <strong>rejected</strong>,
                  please make a new request if you still want elevated
                  privileges.
                </>
              ) : (
                <>
                  Your request to become an {requestStatus.requested_role} is
                  now <strong>{requestStatus.status.toLowerCase()}</strong>
                </>
              )
            ) : (
              <div className="mb">
                <div className="mb-3">
                  <label htmlFor="request-reason" className="form-label">
                    Role
                  </label>
                  <select
                    className="form-select"
                    aria-label="requested-role"
                    onChange={handleRequestRole}
                    defaultValue="default"
                  >
                    <option value="default" disabled>
                      Select a role
                    </option>
                    {!isResearcher && (
                      <option value="researcher">Researcher</option>
                    )}
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-1">
                  <label htmlFor="request-reason" className="form-label">
                    Reason for Requesting Role
                  </label>
                  <textarea
                    className="request-textarea mb-0"
                    id="exampleFormControlTextarea1"
                    onChange={handleRequestReason}
                  ></textarea>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {!requestStatus.success ? (
              <Button variant="primary" onClick={handleAdminRequest}>
                Submit
              </Button>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
}

export default Sidebar;

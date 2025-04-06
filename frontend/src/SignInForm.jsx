import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import "./static/sign-in.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function SignInForm() {
  const [error, setError] = useState("");
  const [csrf, setCsrf] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword2, setNewPassword2] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [email, setEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [code, setCode] = useState("");
  const [modalError, setModalError] = useState("");
  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const handlePasswordClose = () => setShowPasswordModal(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(
    localStorage.getItem("forgetpasswordtimer") > 0
      ? localStorage.getItem("forgetpasswordtimer")
      : "",
  );
  const [sendDisabled, setSendDisabled] = useState(true);

  async function checkEmail(email) {
    return fetch(backendUrl + "api/accounts/check-email/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw errorData;
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Email Checked:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error Checking Email:", error);
        throw error;
      });
  }

  async function sendCode(email) {
    return fetch(backendUrl + "api/accounts/forget-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            setModalError(errorData.error);
            throw errorData;
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Code sent:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error sending code:", error);
        throw error;
      });
  }

  async function verifyCode(email, code) {
    return fetch(backendUrl + "api/accounts/confirm-email/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, verification_code: code }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw errorData;
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Code verified:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error verifying code:", error);
        throw error;
      });
  }

  function getCSRF() {
    fetch(backendUrl.concat("api/csrf/"), {
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

  const handleEmail = (event) => {
    console.log("Email Entered:", event.target.value);
    setEmail(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleShowEmail = () => {
    setShowEmail(true);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleUpdatePassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleUpdatePassword2 = (event) => {
    setNewPassword2(event.target.value);
  };

  const handleSend = () => {
    if (timer > 0) {
      setSendDisabled(true);
    } else {
      setSendDisabled(false);
      setTimer(180);
    }
    setModalError("");
    if (email.trim() === "") {
      setModalError("Please fill Email first");
      setSendDisabled(false);
      return;
    }
    if (!email.toLowerCase().endsWith(".ac.uk")) {
      setModalError(
        "Email must belong to an educational institution (.ac.uk).",
      );
      setSendDisabled(false);
      return;
    }
    sendCode(email)
      .then(() => {
        setVerifyDisabled(false);
        setSendDisabled(true);
      })
      .catch((error) => {
        setSendDisabled(false);
        console.error("Error sending code:", error);
      });
  };

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime - 1;
          console.log("set");
          localStorage.setItem("forgetpasswordtimer", newTime);
          return newTime;
        });
      }, 1000);
    } else {
      setSendDisabled(false);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    getCSRF();
  }, [])

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleVerify = (event) => {
    event.preventDefault();
    verifyCode(email, code)
      .then(() => {
        setError("");
        setModalError("");
        setVerificationError(false);
        setVerifyDisabled(true);
        checkEmail(email)
          .then(() => {
            setShowEmail(false);
            setShowPasswordModal(true);
            setTimer(0);
          })
          .catch((error) => {
            setModalError(error.error || "Error checking email.");
          });
        setModalError("");
        setError("");
      })
      .catch((err) => {
        console.error("Error verifying code:", err);
        setVerificationError(true);
      });
  };

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleUserNameChange(event) {
    setUserName(event.target.value);
  }

  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  const handleSave = () => {
    if (newPassword !== newPassword2) {
      setModalError("Passwords do not match!");
      return;
    }
    const csrfToken = Cookies.get("csrftoken");
    fetch(backendUrl.concat("api/accounts/update-password/"), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ email: email, password: newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Password updated successfully.") {
          setModalError("");
          handlePasswordClose();
        } else {
          const errorKeys = Object.keys(data);
          if (errorKeys.length > 0) {
            const firstKey = errorKeys[0];
            const firstMessage = data[firstKey][0] || data[firstKey];
            setModalError(firstMessage);
          } else {
            setModalError("An unknown error occurred.");
          }
          console.error("Update failed:", data.error || "Unknown error");
        }
      })
      .catch((err) => {
        console.error("Error updating Password:", err);
        const errorKeys = Object.keys(err);
        if (errorKeys.length > 0) {
          const firstKey = errorKeys[0];
          const firstMessage = err[firstKey][0] || err[firstKey];
          setModalError(firstMessage);
        } else {
          setModalError("An unknown error occurred.");
        }
      });
  };

  async function login() {
    await fetch(`${backendUrl}api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf,
      },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(isResponseOk)
      .then(() => {
        setUserName("");
        setPassword("");
        setError("");
        navigate("/dashboard");
        localStorage.setItem("timer", 0);
        localStorage.setItem("registertimer", 0);
        localStorage.setItem("forgetpasswordtimer", 0);
      })
      .catch(() => {
        setError("Wrong username or password");
      });
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      await login();
    } catch (err) {
      console.log(err);
    }
  }

  const handleEmailClose = () => {
    setShowEmail(false);
    setCode("");
    setError("");
    setModalError("");
    //setSendDisabled(false);
    setVerifyDisabled(false);
  };

  return (
    <div className="sign-in-wrapper">
      <div className="sign-in-container">
        {/* Left Side - Form */}
        <div className="sign-in-form">
          <h2>Welcome Back</h2>
          <p>Please sign in to continue.</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Username"
                value={username}
                onChange={handleUserNameChange}
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="btn border-0 position-absolute end-0 top-50 translate-middle-y me-2"
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>

            {error && <p className="warning">{error}</p>}

            <div className="remember-me">
              <span
                className="forgot-password"
                onClick={handleShowEmail}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  color: "blue",
                }}
              >
                Forgot password?
              </span>
            </div>

            <button className="sign-in-button" type="submit">
              Login
            </button>

            <p className="register-link">
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>

        {/* Right Side - Background Image */}
        <div className="sign-in-image">
          <div className="overlay-text">Carbon Footprint Calculator</div>
        </div>

        <Modal
          show={showEmail}
          onHide={handleEmailClose}
          className="email-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Check Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ width: "87%" }}>
              <InputGroup style={{ marginLeft: "8.5%" }}>
                <Form.Control
                  name="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Enter your email"
                  aria-label="email"
                  aria-describedby="basic-addon-email"
                />
                <Button
                  className="verify-button"
                  type="button"
                  onClick={handleSend}
                  disabled={sendDisabled}
                >
                  {sendDisabled
                    ? `Resend code in ${formatTime(timer)}`
                    : "Send code"}
                </Button>
              </InputGroup>
            </div>

            <div className="sign-in-form">
              <p>Please enter the code emailed to you below:</p>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  name="email-verify"
                  placeholder="Enter the code here"
                  onChange={handleCodeChange}
                />
              </InputGroup>
              <hr />
              {verificationError && (
                <p className="warning">Your code is incorrect.</p>
              )}
              {modalError && <p className="warning">{modalError}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  className="verify-button"
                  type="button"
                  onClick={handleVerify}
                  disabled={verifyDisabled}
                >
                  Verify my Email
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showPasswordModal}
          onHide={handlePasswordClose}
          className="password-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3 position-relative">
              <Form.Control
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handleUpdatePassword}
                placeholder="New Password"
                aria-label="password"
                aria-describedby="basic-addon-password"
              />
              <button
                type="button"
                onClick={toggleShowNewPassword}
                className="btn border-0 position-absolute end-0 top-50 translate-middle-y me-2"
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </InputGroup>

            {/* Confirm Password Input */}
            <InputGroup className="mb-3 position-relative">
              <Form.Control
                name="newPassword2"
                type={showNewPassword ? "text" : "password"}
                value={newPassword2}
                onChange={handleUpdatePassword2}
                placeholder="Confirm Password"
                aria-label="password2"
                aria-describedby="basic-addon-password2"
              />
              <button
                type="button"
                onClick={toggleShowNewPassword}
                className="btn border-0 position-absolute end-0 top-50 translate-middle-y me-2"
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </InputGroup>
            {modalError && <p className="warning">{modalError}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              className="verify-button"
              onClick={() => {
                handleSave();
              }}
            >
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default SignInForm;

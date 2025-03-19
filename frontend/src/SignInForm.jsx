import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import "./static/sign-in.css";
import { useAuth } from "./useAuth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
  return fetch(backendUrl + "api/accounts/send-email-confirmation-token/", {
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

function SignInForm() {
  const [error, setError] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword2, setNewPassword2] = useState("");
  const { isAuthenticated, loading } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState("");
  const [email, setEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [code, setCode] = useState("");
  const [modalError, setModalError] = useState("");
  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const handleEmailClose = () => setShowEmail(false);
  const handlePasswordClose = () => setShowPasswordModal(false);
  const navigate = useNavigate();

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
    if (email.trim() === "") {
      alert("Please fill Email first");
      return;
    }
    if (!email.toLowerCase().endsWith(".ac.uk")) {
      alert("Email must belong to an educational institution (.ac.uk).");
      return;
    }
    sendCode(email)
      .then(() => {
        setVerifyDisabled(false);
      })
      .catch((error) => {
        console.error("Error sending code:", error);
      });
  };

  const handleVerify = (event) => {
    event.preventDefault();
    verifyCode(email, code)
      .then((data) => {
        setIsVerified(true);
        setVerifiedMessage("Your email is verified successfully.");
        setVerifyDisabled(true);
        setVerificationError(false);
      })
      .catch((err) => {
        console.error("Error verifying code:", err);
        setVerificationError(true);
      });
  };

  const handleNext = () => {
    if (!isVerified) {
      setModalError("Please verify your email before proceeding.");
      return;
    }
    checkEmail(email)
      .then(() => {
        setShowEmail(false);
        setShowPasswordModal(true);
      })
      .catch((error) => {
        setModalError(error.error || "Error checking email.");
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
      alert("Passwords do not match!");
      return;
    }
    fetch(backendUrl.concat("api/accounts/update-password/"), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:email, password:newPassword}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Password updated successfully.") {
          handlePasswordClose();
        } else {
          console.error("Update failed:", data.error || "Unknown error");
        }
      })
      .catch((error) => console.error("Error updating Password:", error));
  };

  async function login() {
    await fetch(`${backendUrl}api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(isResponseOk)
      .then((data) => {
        setUserName("");
        setPassword("");
        setError("");
        navigate("/dashboard");
      })
      .catch((err) => {
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
                placeholder="Email Address"
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
                className="show-password"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && <p className="warning">{error}</p>}

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember"> Remember me</label>
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

        <Modal show={showEmail} onHide={handleEmailClose} className="email-modal">
          <Modal.Header closeButton>
            <Modal.Title>Check Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon-email"></InputGroup.Text>
              <Form.Control
                name="email"
                value={email}
                onChange={handleEmail}
                placeholder="Enter your email"
                aria-label="email"
                aria-describedby="basic-addon-email"
              />
              <Button className="verify-button" type="button" onClick={handleSend}>
                Send code
              </Button>
            </InputGroup>
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
              {modalError && (
                <p className="warning">{modalError}</p>
              )}
              {verifiedMessage && (
                <p className="success">{verifiedMessage}</p>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  className="verify-button"
                  type="button"
                  onClick={handleVerify}
                  disabled={verifyDisabled}
                >
                  Verify my Email
                </Button>
                <Button
                  className="next-button"
                  type="button"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={showPasswordModal} onHide={handlePasswordClose} className="password-modal">
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <InputGroup className="mb-3 position-relative">
              <InputGroup.Text id="basic-addon-password">
                New Password
              </InputGroup.Text>
              <Form.Control
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handleUpdatePassword}
                placeholder="New Password"
                aria-label="password"
                aria-describedby="basic-addon-password"
              />
              <Button
                type="button"
                onClick={toggleShowNewPassword}
                className="show-NewPassword"
              >
                {showNewPassword ? "Hide" : "Show"}
              </Button>
            </InputGroup>

            {/* Confirm Password Input */}
            <InputGroup className="mb-3 position-relative">
              <InputGroup.Text id="basic-addon-password2">
                Confirm Password
              </InputGroup.Text>
              <Form.Control
                name="newPassword2"
                type={showNewPassword ? "text" : "password"}
                value={newPassword2}
                onChange={handleUpdatePassword2}
                placeholder="Confirm Password"
                aria-label="password2"
                aria-describedby="basic-addon-password2"
              />
              <Button
                type="button"
                onClick={toggleShowNewPassword}
                className="show-password"
              >
                {showNewPassword ? "Hide" : "Show"}
              </Button>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
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

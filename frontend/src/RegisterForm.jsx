import "bootstrap-icons/font/bootstrap-icons.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import "./static/sign-in.css";
import { useAuth } from "./useAuth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function createUser(user) {
  return fetch(`${backendUrl}api/accounts/create-user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
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
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

async function validateUser(user) {
  return fetch(`${backendUrl}api/accounts/register/`, {
    // ENTER THE CALL TO BACKEND HERE WHICH WOULD CHECK IF USERS' DETAILS ARE CORRECT AND CAN BE SUBMITTED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
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
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

async function sendCode(user) {
  return fetch(`${backendUrl}api/accounts/send-email-confirmation-token/`, {
    // ENTER THE CALL TO BACKEND HERE WHICH WOULD SEND THE CODE TO USER
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
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
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

async function verifyCode(user, code) {
  return fetch(`${backendUrl}api/accounts/confirm-email/`, {
    // ENTER THE CALL TO BACKEND HERE TO VERIFY VERIFICATION CODE
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, verification_code: code }),
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
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

function RegisterForm({ forceVisible = false }) {
  const [user, setUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    email: "",
    institute: "",
    research_field: "",
  });

  const [code, setCode] = useState("");
  const [error, setError] = useState();
  const [modalError, setModalError] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(forceVisible);
  const { isAuthenticated, loading } = useAuth();
  const [verifyDisabled, setVerifyDisabled] = useState(false);
  const [timer, setTimer] = useState(
    localStorage.getItem("registertimer") || "",
  );
  const [sendDisabled, setSendDisabled] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  useEffect(() => {
    fetch(`${backendUrl}api/institutions/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fail to get an university lists.");
        }
        return response.json();
      })
      .then((data) => {
        setInstitutions(data);
      })
      .catch((err) => {
        console.error("Error fetching institutions:", err);
      });
  }, []);

  useEffect(() => {
    fetch(`${backendUrl}api/fields/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fail to get a field lists.");
        }
        return response.json();
      })
      .then((data) => {
        setFields(data);
      })
      .catch((err) => {
        console.error("Error fetching fields:", err);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        handleProtect();
      }
    }
  }, [isAuthenticated, loading]);

  const handleVerify = (event) => {
    // when user has received their code, they paste it into the text box and press "Verify my Email". Then this function attempts to verify the verification code.
    // if verifyCode is successful, the function attempts to create the account with createUser.
    // If createUser succeeds, user is routed to sign-in.
    // If createUser doesn't succeed, modalError is set in the modal. It is expected that by this point - user details have been verified by validateUser, and createUser shouldn't fail.
    // if verifyCode is not successful, verificationError is set in the modal
    event.preventDefault();
    verifyCode(user, code)
      .then((data) => {
        console.log("Code verified:", data);
        setError("");
        setVerificationError(false);
        setVerifiedMessage("Your email is verified successfully.");
        setVerifyDisabled(true);
        createUser(user)
          .then((data) => {
            console.log("User created:", data);
            setModalError("");
            navigate("/sign-in");
          })
          .catch((err) => {
            console.error("Error creating user:", err);
            setModalError(true);
          });
      })
      .catch((err) => {
        console.error("Error verifying code:", err);
        setVerificationError(true);
      });
  };

  const handleSend = () => {
    // when the user submits their details, handleModal first tries to validate user details,
    // and make sure that when the user next submits their request to create an account, there will be no errors.
    // if the new user's details could not be verified, error messages are displayed, to instruct the user on what went wrong.
    // if the new user's details are verified successfuly, the confirmation code is sent to the user through sendCode backend API call, and the modal is set visible
    sendCode(user)
      .then(() => {
        setTimer(180);
        setSendDisabled(true);
      })
      .catch((error) => {
        console.error("Error sending code:", error);
      });
  };
  const handleModal = (event) => {
    // when the user submits their details, handleModal first tries to validate user details,
    // and make sure that when the user next submits their request to create an account, there will be no errors.
    // if the new user's details could not be verified, error messages are displayed, to instruct the user on what went wrong.
    // if the new user's details are verified successfuly, the confirmation code is sent to the user through sendCode backend API call, and the modal is set visible
    event.preventDefault();
    validateUser(user)
      .then((data) => {
        console.log("User valid:", data);
        setError("");
        setVisible(true);
        setVerificationError(false);
        sendCode(user)
          .then(() => {
            setTimer(180);
            setSendDisabled(true);
          })
          .catch((error) => {
            console.error("Error sending code:", error);
          });
      })
      .catch((err) => {
        console.error("Error validating new user details:", err);
        const errorKeys = Object.keys(err);
        if (errorKeys.length > 0) {
          const firstKey = errorKeys[0];
          const firstMessage = err[firstKey][0];
          setError(firstMessage);
        } else {
          setError("An unknown error occurred.");
        }
      });
  };

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem("registertimer", newTime);
          return newTime;
        });
      }, 1000);
    } else {
      setSendDisabled(false);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleInstitutionsChange = (event) => {
    const selectedInstitute = event.target.value;
    setUser((prevUser) => ({ ...prevUser, institute: selectedInstitute }));
  };

  const handleFieldsChange = (event) => {
    const selectedField = event.target.value;
    setUser((prevUser) => ({ ...prevUser, research_field: selectedField }));
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleProtect = () => {
    navigate("/dashboard");
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleClose = () => {
    setVisible(false);
    setCode("");
    setError("");
    setVerificationError(false);
    setVerifiedMessage("");
    setSendDisabled(false);
    setVerifyDisabled(false);
  };

  return (
    <div className="sign-in-wrapper">
      <Modal
        show={visible}
        onHide={handleClose}
        centered
        size="lg"
        data-testid="verification-modal"
      >
        {/* when modal is set to visible, the input field takes the code from the user. when the user submits the code, handleSubmit is performed */}
        <Modal.Header closeButton>
          <Modal.Title>Enter Confirmation Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="sign-in-form">
            <form onSubmit={handleVerify}>
              <p>Please enter the code emailed to you below:</p>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  name="email-verify"
                  placeholder="Enter the code here"
                  onChange={handleCodeChange}
                />
              </InputGroup>
              <button
                className="verify-button"
                onClick={() => handleSend(user)}
                disabled={sendDisabled}
              >
                {sendDisabled
                  ? `Resend code in ${formatTime(timer)}`
                  : "Send code"}
              </button>
              <hr />
              {/* verificationError is displayed if the code by user could not be verified, modalError is displayed if the user could not be created for any reason */}
              {verificationError && (
                <p className="warning">Your code is incorrect. </p>
              )}
              {modalError && (
                <p className="warning">An unknown error occurred.</p>
              )}
              {verifiedMessage && <p className="success">{verifiedMessage}</p>}

              <button
                className="verify-button"
                type="button"
                onClick={handleVerify}
                disabled={verifyDisabled}
              >
                Register
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <div className="sign-in-container">
        {/* Left Side of contaiiner- Registration Form */}
        <div className="sign-in-form">
          <h2>Create an Account</h2>
          <p>Please fill in the details below to register.</p>

          <form onSubmit={handleModal}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="Email"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="username"
                className="input-field"
                placeholder="Username"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="first_name"
                className="input-field"
                placeholder="First Name"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="last_name"
                className="input-field"
                placeholder="Last Name"
                onChange={handleChange}
              />
            </div>

            {/* Dropdown for Academic Institution, not searchable at the moment  */}
            <div className="input-group">
              <select
                name="institute"
                className="input-field"
                value={user.institute}
                onChange={handleInstitutionsChange}
              >
                <option value="" disabled>
                  Select an institution
                </option>
                {institutions.map((inst, index) => (
                  <option key={index} value={inst.name}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown for Research Field, need to be updated */}
            <div className="input-group">
              <select
                name="research_field"
                className="input-field"
                value={user.research_field}
                onChange={handleFieldsChange}
              >
                <option value="" disabled>
                  Select a Research Field
                </option>
                {fields.map((inst, index) => (
                  <option key={index} value={inst.name}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field"
                placeholder="Password"
                onChange={handleChange}
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

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password2"
                className="input-field"
                placeholder="Confirm Password"
                onChange={handleChange}
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

            <button className="sign-in-button" type="submit">
              Register
            </button>

            <p className="register-link">
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </p>
          </form>
        </div>

        {/* Right Side of the container- added imaged with overlay*/}
        <div className="register-image">
          <div className="overlay-text">Carbon Footprint Calculator</div>
        </div>
      </div>
    </div>
  );
}

RegisterForm.propTypes = {
  forceVisible: PropTypes.bool,
};

export default RegisterForm;

import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./static/sign-in.css";
import { useAuth } from "./useAuth";
import Modal from "react-bootstrap/Modal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function createUser(user) {
  return fetch(backendUrl + "api/accounts/register/", {
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
  return fetch(backendUrl + "api/accounts/???/", { // ENTER THE CALL TO BACKEND HERE WHICH WOULD CHECK IF USERS' DETAILS ARE CORRECT
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
  return fetch(backendUrl + "api/accounts/???/", { // ENTER THE CALL TO BACKEND HERE WHICH WOULD SEND THE CODE TO USER
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

async function verifyCode(code) {
  return fetch(backendUrl + "api/accounts/???/", { // ENTER THE CALL TO BACKEND HERE TO VERIFY VERIFICATION CODE
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(code),
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

function RegisterForm() {
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
  const [error, setError] = useState();
  const [code, setCode] = useState("");
  const [errorVerification, setErrorVerification] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  useEffect(() => {
    fetch(backendUrl.concat("api2/institutions/"))
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
    fetch(backendUrl.concat("api2/fields/"))
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

  const handleSubmit = (event) => {
    event.preventDefault();
    verifyCode(code)
      .then((data) => {
        console.log("Code verified:", data);
        setError("");
        createUser(user)
          .then((data) => {
            console.log("User created:", data);
            setError("");
            navigate("/sign-in");
          })
          .catch((err) => {
            console.error("Error creating user:", err);
            const errorKeys = Object.keys(err);
            setError("An unknown error occurred.");
          });
      })
      .catch((err) => {
        console.error("Error verifying code:", err);
        setErrorVerification(true);
      });
  };

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

  const handleModal = (event) => {
    event.preventDefault();
    validateUser(user)
    .then((data) => {
      console.log("User valid:", data);
      setError("");
      sendCode(user);
      setVisible(true);
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
      setVisible(true);
    });
  };

  return (
    <div className="sign-in-wrapper">
      <Modal show={visible} centered size="lg">
        <Modal.Header>
          <Modal.Title>Enter Confirmation Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="sign-in-form">
            <form onSubmit={handleSubmit}>
            
              <p>Please enter the code emailed to you below:</p>
              <p>{code}</p>
              <input
                type="text"
                name="email-verify"
                className="input-field"
                placeholder="Enter the code here"
                onChange={handleCodeChange}
              />

              {errorVerification && 
              <p className="warning">
                Your code is incorrect. <Link onClick={() => sendCode(user)}>Resend code</Link>
              </p>
              }
              <hr/>

              <button className="sign-in-button" type="submit">
                Verify my Email
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
                className="show-password"
              >
                {showPassword ? "Hide" : "Show"}
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
                className="show-password"
              >
                {showPassword ? "Hide" : "Show"}s
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

export default RegisterForm;

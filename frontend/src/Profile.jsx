import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function updateEmail(currentEmail, newEmail) {
  return fetch(backendUrl + "api/accounts/update-email/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newEmail: newEmail, currentEmail: currentEmail }),
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

async function sendCode(email) {
  return fetch(backendUrl + "api/accounts/send-email-confirmation-token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // 보내는 값은 객체 형태로 감쌉니다.
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
      console.log(data);
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
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error("Error verifying code:", error);
      throw error;
    });
}

const Profile = () => {
  const [first_name, setFirst_name] = useState();
  const [last_name, setLast_name] = useState();
  const [email, setEmail] = useState();
  const [institute, setInstitute] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isResearcher, setIsResearcher] = useState(false);
  const [researchField, setResearchField] = useState();
  const [showPassword, setShowPassword] = useState(false);
  // newEmail 상태는 사용자가 "Change Email" 모달에서 입력하는 값입니다.
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [updateForm, setUpdateForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    institute: "",
    research_field: "",
    password: "",
    password2: "",
  });
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [institutions, setInstitutions] = useState([]);
  const [fields, setFields] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [showEmail, setShowEmail] = useState(false);
  const handleEmailClose = () => setShowEmail(false);
  const [modalError, setModalError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState("");
  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const navigate = useNavigate();

  const handleShow = () => {
    setUpdateForm({
      first_name: first_name || "",
      last_name: last_name || "",
      email: email || "",
      institute: institute || "",
      research_field: researchField || "",
      password: "",
      password2: "",
    });
    setShow(true);
  };

  // 모달 열 때 newEmail을 초기화하지 않고 그대로 두어 사용자가 입력한 값이 유지되게 함.
  const handleEmailShow = () => {
    setShowEmail(true);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleEmailChange = (event) => {
    console.log("New Email Changed:", event.target.value);
    setNewEmail(event.target.value);
  };

  const handleSend = () => {
    if (newEmail.trim() === "") {
      alert("Please fill Email first");
      return;
    }
    if (!newEmail.toLowerCase().endsWith(".ac.uk")) {
      alert("Email must belong to an educational institution (.ac.uk).");
      return;
    }
    sendCode(newEmail)
      .then(() => {
        setVerifyDisabled(false);
      })
      .catch((error) => {
        console.error("Error sending code:", error);
      });
  };

  const handleVerify = (event) => {
    event.preventDefault();
    verifyCode(newEmail, code)
      .then((data) => {
        console.log("Code verified:", data);
        setIsVerified(true);
        setVerifiedMessage("Your email is verified successfully.");
        setVerifyDisabled(true);
      })
      .catch((err) => {
        console.error("Error verifying code:", err);
        setVerificationError(true);
      });
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isVerified) {
      setModalError("Please verify your email before proceeding.");
      return;
    }
    updateEmail(email, newEmail)
      .then((data) => {
        console.log("Email updated:", data);
        setModalError("");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error updating email:", err);
        setModalError(true);
      });
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  useEffect(() => {
    getSession();
    getName();
  }, []);

  useEffect(() => {
    fetch(backendUrl.concat("api2/institutions/"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fail to get university lists.");
        }
        return response.json();
      })
      .then((data) => {
        setInstitutions(data);
      })
      .catch((err) => {
        console.error("Error fetching institutions:", err);
      });
  }, [backendUrl]);

  useEffect(() => {
    fetch(backendUrl.concat("api2/fields/"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fail to get field lists.");
        }
        return response.json();
      })
      .then((data) => {
        setFields(data);
      })
      .catch((err) => {
        console.error("Error fetching fields:", err);
      });
  }, [backendUrl]);

  function getSession() {
    fetch(backendUrl.concat("api2/session/"), {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
      });
  }

  const getName = () => {
    fetch(backendUrl.concat("api2/whoami/"), {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFirst_name(data.forename);
        setLast_name(data.lastname);
        setEmail(data.email);
        setInstitute(data.institute);
        setIsAdmin(data.isAdmin);
        setIsResearcher(data.isResearcher);
        setResearchField(data.research_field);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSave = () => {
    if (updateForm.password !== updateForm.password2) {
      alert("Passwords do not match!");
      return;
    }
    const csrfToken = getCookie("csrftoken");
    fetch(backendUrl.concat("api/accounts/update/"), {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(updateForm),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          handleClose();
          getName();
        } else {
          console.error("Update failed:", data.error);
        }
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  return (
    <div
      className="bg-grey profile-card card mb-4 p-4"
      style={{ width: "100%" }}
    >
      <div className="row align-items-center">
        <div className="container text-white">
          <div className="row">
            <p>
              <strong>Role: </strong>{" "}
              {isAdmin ? "admin" : isResearcher ? "researcher" : "user"}
            </p>
            <p>
              <strong>Forename: </strong> {first_name || "Loading..."}
            </p>
            <p>
              <strong>Surname: </strong> {last_name || "Loading..."}
            </p>
          </div>
          <div className="row">
            <p>
              <strong>Institution: </strong> {institute || "Not provided"}
            </p>
            <p>
              <strong>ResearchField: </strong> {researchField || "Not provided"}
            </p>
            <p>
              <strong>Email: </strong> {email || "Not provided"}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleShow}>
            Edit Detail
          </button>
          <button className="btn btn-primary" onClick={handleEmailShow}>
            Change Email
          </button>
        </div>

        {/* Profile Update Modal */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Profile Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon-forename">
                Forename
              </InputGroup.Text>
              <Form.Control
                name="first_name"
                value={updateForm.first_name}
                onChange={handleUpdateFormChange}
                placeholder="Forename"
                aria-label="forename"
                aria-describedby="basic-addon-forename"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon-surname">
                Surname
              </InputGroup.Text>
              <Form.Control
                name="last_name"
                value={updateForm.last_name}
                onChange={handleUpdateFormChange}
                placeholder="Surname"
                aria-label="surname"
                aria-describedby="basic-addon-surname"
              />
            </InputGroup>
            <div className="form-floating mb-3">
              <select
                name="institute"
                className="form-select"
                id="floatingInputInstitute"
                value={updateForm.institute}
                onChange={handleUpdateFormChange}
                style={{ fontSize: "12px" }}
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
              <label htmlFor="floatingInputInstitute">
                Academic Institution
              </label>
            </div>
            <div className="form-floating mb-3">
              <select
                name="research_field"
                className="form-select"
                id="floatingInputResearch"
                value={updateForm.research_field}
                onChange={handleUpdateFormChange}
                style={{ fontSize: "12px" }}
              >
                <option value="" disabled>
                  Select a Research Field
                </option>
                {fields.map((field, index) => (
                  <option key={index} value={field.name}>
                    {field.name}
                  </option>
                ))}
              </select>
              <label htmlFor="floatingInputResearch">Research Field</label>
            </div>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon-password">
                Password
              </InputGroup.Text>
              <Form.Control
                name="password"
                type={showPassword ? "text" : "password"}
                value={updateForm.password}
                onChange={handleUpdateFormChange}
                placeholder="Password"
                aria-label="password"
                aria-describedby="basic-addon-password"
              />
              <Button
                type="button"
                onClick={toggleShowPassword}
                className="show-password"
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon-password2">
                Confirm Password
              </InputGroup.Text>
              <Form.Control
                name="password2"
                type={showPassword ? "text" : "password"}
                value={updateForm.password2}
                onChange={handleUpdateFormChange}
                placeholder="Confirm Password"
                aria-label="password2"
                aria-describedby="basic-addon-password2"
              />
            </InputGroup>
            <Button
              type="button"
              onClick={toggleShowPassword}
              className="show-password"
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                handleSave();
                handleClose();
                if (
                  updateForm.password.trim() !== "" &&
                  updateForm.password2.trim() !== ""
                ) {
                  navigate("/sign-in");
                } else {
                  window.location.reload();
                }
              }}
            >
              Confirm
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Change Email Modal */}
        <Modal show={showEmail} onHide={handleEmailClose}>
          <Modal.Header closeButton>
            <Modal.Title>Change Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon-email">
                New Email
              </InputGroup.Text>
              <Form.Control
                name="newEmail"
                value={newEmail}
                onChange={handleEmailChange}
                placeholder="Enter new email"
                aria-label="newEmail"
                aria-describedby="basic-addon-newEmail"
              />
            </InputGroup>
            <Button
              className="verify-button"
              type="button"
              onClick={handleSend}
            >
              Send code
            </Button>
            <div className="sign-in-form">
              <form onSubmit={handleVerify}>
                <p>Please enter the code emailed to you below:</p>
                <input
                  type="text"
                  name="email-verify"
                  className="input-field"
                  placeholder="Enter the code here"
                  onChange={handleCodeChange}
                />
                <hr />
                {verificationError && (
                  <p className="warning">Your code is incorrect.</p>
                )}
                {modalError && (
                  <p className="warning">An unknown error occurred.</p>
                )}
                {verifiedMessage && (
                  <p className="success">{verifiedMessage}</p>
                )}
                <button
                  className="verify-button"
                  type="button"
                  onClick={handleVerify}
                  disabled={verifyDisabled}
                >
                  Verify my Email
                </button>
                <button
                  className="register-button"
                  type="button"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;

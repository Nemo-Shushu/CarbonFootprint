import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Table } from "react-bootstrap";
import Sidebar from "./Sidebar";
import "./scss/custom.scss";
import "./static/AdminTools.css";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AdminTool() {
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [csrftoken, setCsrftoken] = useState();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingUserId, setRejectingUserId] = useState(null);

  useEffect(() => {
    getRequests();
    setCsrftoken(Cookies.get("csrftoken"));
  }, []);

  async function getRequests() {
    fetch(`${backendUrl}api/admin-request-list/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        // Filter requests where status is 'pending'
        const pendingRequests = data.filter(
          (request) => request.status === "Pending",
        );

        setRequests(pendingRequests);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function fetchUserDetails(userId, request) {
    try {
      const response = await fetch(
        `${backendUrl}api/accounts/user/id/${userId}/`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      setSelectedUser(data);
      setSelectedRequest(request);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  async function handleAcceptRejectPost(user_id, outcome) {
    await fetch(`${backendUrl}api/approve-or-reject-request/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ user_id: user_id, state: outcome }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to handle request decision");
        }
        return response.json();
      })
      .then(() => {
        // Refresh the requests list after approval/rejection
        getRequests();
        // Close any open modals
        handleCloseUserModal();
        handleCloseRejectModal();
      })
      .catch((err) => {
        console.error("Failed to handle request decision", err);
      });
  }

  function handleCloseUserModal() {
    setShowUserModal(false);
  }

  function handleCloseRejectModal() {
    setShowRejectModal(false);
  }

  function handleApprove(userId) {
    handleAcceptRejectPost(userId, "Approved");
  }

  function handleReject(userId) {
    setRejectingUserId(userId);
    setShowRejectModal(true);
  }

  function confirmReject() {
    handleAcceptRejectPost(rejectingUserId, "Rejected");
    handleCloseRejectModal();
  }

  // Handle both direct approve/reject from table and from user detail modal
  function handleAction(request, action) {
    if (action === "Approved") {
      handleApprove(request.user_id);
    } else if (action === "Rejected") {
      handleReject(request.user_id);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar style={{ flex: "0 0 17%" }} />

      {/* Main Content */}
      {requests.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center fs-2"
          style={{
            height: "300px",
            width: "100%",
            color: "gray",
            textAlign: "center",
          }}
        >
          <tr>
            <td colSpan="3" className="text-center">
              No requests available
            </td>
          </tr>
        </div>
      ) : (
        <main className="Main-context">
          <h2 className="mt-4">Admin Requests</h2>
          <div className="table-responsive small mt-3">
            <Table striped hover size="sm">
              <thead className="thead-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Institute</th>
                  <th>Requested Role</th>
                  <th style={{ width: "50%" }}>Reason</th>
                  <th style={{ width: "20%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.user_id}
                    className="align-middle"
                    onClick={() => fetchUserDetails(request.user_id, request)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{request.user__username}</td>
                    <td>{request.user__email}</td>
                    <td>{request.user__institute}</td>
                    <td>{request.requested_role}</td>
                    <td className="text-truncate ellipsis-text">
                      {request.reason}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-outline-success me-2"
                        type="button"
                        style={{
                          padding: "8px 12px",
                          fontWeight: "bold",
                          color: "var(--bs-moss)",
                          borderColor: "var(--bs-moss)",
                        }}
                        onClick={() => handleAction(request, "Approved")}
                      >
                        <i className="bi bi-check-circle-fill"></i> Accept
                      </button>

                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        style={{ padding: "8px 12px", fontWeight: "bold" }}
                        onClick={() => handleAction(request, "Rejected")}
                      >
                        <i className="bi bi-x-circle-fill"></i> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </main>
      )}

      {/* User Details Modal using react-bootstrap */}
      <Modal
        show={showUserModal}
        onHide={handleCloseUserModal}
        size="lg"
        centered
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Forename:</strong> {selectedUser.first_name}
              </p>
              <p>
                <strong>Surname:</strong> {selectedUser.last_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Institute:</strong> {selectedUser.institute}
              </p>
              {selectedRequest && (
                <>
                  <p>
                    <strong>Requested Role:</strong>{" "}
                    {selectedRequest.requested_role}
                  </p>
                  <p>
                    <strong>Reason:</strong> {selectedRequest.reason}
                  </p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedRequest && (
            <>
              <Button
                variant="success"
                className="me-2"
                onClick={() => handleAction(selectedRequest, "Approved")}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => handleAction(selectedRequest, "Rejected")}
              >
                Reject
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={handleCloseUserModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Confirmation Modal using react-bootstrap */}
      <Modal
        show={showRejectModal}
        onHide={handleCloseRejectModal}
        centered
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to reject this request? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmReject}>
            Confirm Reject
          </Button>
          <Button variant="secondary" onClick={handleCloseRejectModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminTool;

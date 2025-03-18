import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function SessionLayout({ children }) {
  const [remainingTime, setRemainingTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [extend, setExtend] = useState(false);

  useEffect(() => {
    const fetchSessionExpiry = async () => {
      try {
        const response = await fetch(`${backendUrl}api2/session-expiry/`, {
          credentials: "include",
        });
        const data = await response.json();
        setRemainingTime(data.remaining_time);
      } catch (error) {
        console.error("Error fetching session expiry:", error);
      }
    };

    fetchSessionExpiry();
    const serverTimerId = setInterval(() => {
      fetchSessionExpiry();
    }, 10000);

    return () => clearInterval(serverTimerId);
  }, []);
  useEffect(() => {
    if (remainingTime <= 300 && remainingTime > 0 && !extend) {
      setShowPopup(true);
      setExtend(true);
    } else {
      setShowPopup(false);
    }
  }, [remainingTime]);

  const handleExtendSession = async () => {
    try {
      const response = await fetch(`${backendUrl}api2/extend-session/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        credentials: "include",
      });
      const data = await response.json();
      setRemainingTime(data.remaining_time);
      setShowPopup(false);
      setExtend(false);
    } catch (error) {
      console.error("Error extending session:", error);
    }
  };

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div>
      {children}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Session Extension</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your session will expire in {minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}. Would you like to extend
            your session?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleExtendSession}>
            Extend Session
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
SessionLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default SessionLayout;

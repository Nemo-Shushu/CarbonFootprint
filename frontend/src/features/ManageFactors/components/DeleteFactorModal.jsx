import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

DeleteFactor.propTypes = {
  showDelete: PropTypes.func,
  handleDelete: PropTypes.func,
  handleClose: PropTypes.func,
};

function DeleteFactor({ showDelete, handleDelete, handleClose }) {
  return (
    <div className="deleteModal">
      <Modal show={showDelete} onHide={handleClose} centered size="sm">
        <Modal.Header closeButton className="text-center">
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p>
              Are you sure you want to delete the following conversion factor?
            </p>
            <p>
              <strong>This action cannot be undone</strong>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeleteFactor;

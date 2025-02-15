import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function DeleteFactor({handleCloseDelete, showDelete}) {

    return (
        <div className="deleteModal">
            <Modal show={showDelete} onHide={handleCloseDelete} centered size="sm">
                <Modal.Header closeButton className="text-center">
                <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="text-center">
                    <p>Are you sure you want to delete the following conversion factor?</p>
                    <p><strong>This action cannot be undone</strong></p>
                </div>
                
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                <Button variant="secondary" onClick={handleCloseDelete}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleCloseDelete}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteFactor;
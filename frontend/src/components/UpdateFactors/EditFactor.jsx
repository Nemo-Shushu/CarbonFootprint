import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function EditFactor({showEdit, handleCloseEdit, modalTitle, selectedFactor}) {

    return (
        <div className="editModal">
            <Modal show={showEdit} onHide={handleCloseEdit} centered>
                <Modal.Header closeButton>
                <Modal.Title>{modalTitle} Conversion Factor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div class="input-group mb-3">
                    <label for="basic-url" class="form-label">Activity Name</label>
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder={selectedFactor.name} aria-label="Recipient's username" aria-describedby="basic-addon2"></input>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <label for="basic-url" class="form-label">Activity Value</label>
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder={selectedFactor.value} aria-label="Recipient's username" aria-describedby="basic-addon2"></input>
                        <span class="input-group-text" id="basic-addon2">kg CO2e</span>
                    </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEdit}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleCloseEdit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditFactor;
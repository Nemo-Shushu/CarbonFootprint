import React, {useState} from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function EditFactor({show, handleClose, modalTitle, selectedFactor, handleSubmit, setSelectedFactor, buttonContents}) {

    function handleChange(event) {
        const {name, value} = event.target;
        setSelectedFactor((prevState) => ({ ...prevState, [name]: value }));
    }

    return (
        <div className="editModal">
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                <Modal.Title>{modalTitle} Conversion Factor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    <div class="input-group mb-3">
                        <label for="basic-url" class="form-label">Activity Name</label>
                        <div class="input-group">
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                name="activity"
                                placeholder={selectedFactor.activity}
                                onChange={handleChange}
                            ></input>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <label for="basic-url" class="form-label">Activity Value</label>
                        <div className="input-group">
                            <input
                                type="text"
                                class="form-control"
                                placeholder={selectedFactor.value}
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                name="value"
                                onChange={handleChange}
                            ></input>
                            <span class="input-group-text" id="basic-addon2">kg CO2e</span>
                        </div>
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {buttonContents}
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default EditFactor;
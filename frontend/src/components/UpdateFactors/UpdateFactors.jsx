import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../useAuth";
import Sidebar from "../../Sidebar";
import "./UpdateFactors.css";
import { Tooltip } from 'react-tooltip';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function UpdateFactors() {
    const navigate = useNavigate();

    useEffect(() => {
        getConversionFactors();
    }, []);

    const [conversionFactors, setConversionFactors] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    
    // set title for the delete and edit modals
    const [modalTitle, setModalTitle] = useState("");

    // used to populate and unpopulate modal popups
    const initialFactorValue = [
        { id: 0, name: "", value: 0}
    ];
    const [selectedFactor, setSelectedFactor] = useState(initialFactorValue);

    function handleProtect() {
        navigate("/sign-in")
    };
    
    function handleCloseEdit() {
        setSelectedFactor({id: 0, name: "", value: 0});
        setShowEdit(false);
    }

    function handleCloseDelete() {
        setShowDelete(false);
    }
    
    function handleShowEdit(id, name, value) {
        setModalTitle("Edit");
        setSelectedFactor({id, name, value});
        setShowEdit(true);
    }

    function handleShowCreate() {
        setModalTitle("Create a New");
        setShowEdit(true);
    }
    
    function handleShowDelete() {
        setShowDelete(true);
    }

    function getConversionFactors() {
        fetch(backendUrl.concat('api/accounts/conversion-factors/'), {
            method: "GET",
            credentials: "include",
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('failed to retrieve conversion factors');
            }
            return response.json();
          })
          .then(data => {
            setConversionFactors(data);
            console.log(data);
          })
          .catch(err => {
            console.error('failed to retrieve conversion factors', err);
        });
    }

    return useAuth() ? (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 17%", }} />
            <main style={{flex: "1", padding: "1rem", overflowY: "auto",}} className="update-factors-container">
                <div class="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-8 align-middle" style={{paddingLeft: "0px"}}>
                            <h2 className="text-start">Update Conversion Factors</h2>
                        </div>
                        <div class="col-6 col-md-4 text-end">
                        <Button onClick={handleShowCreate}>Add New Conversion Factor</Button>
                        </div>
                    </div>
                </div>

                <table className="table table-hover table-striped">
                    <thead>
                        <tr className="align-middle text-start">
                        <th scope="col" style={{width:"60%"}}>Activity</th>
                        <th scope="col" style={{width:"30%"}}>kg CO2e</th>
                        <th scope="col" style={{width:"10%"}}></th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    {conversionFactors.map((factor) => (
                        <tr className="align-middle text-start">
                        <td>{factor.activity}</td>
                        <td>{factor.value}</td>
                        <td>
                            <a className="edit-icon me-5" onClick={() => handleShowEdit(factor.id, factor.activity, factor.value)}>
                                <i className="bi bi-pen-fill mt-2 mb-3" style={{fontSize: "20px"}}></i>
                            </a>
                            <a className="delete-icon me-5 text-danger" onClick={handleShowDelete}>
                                <i class="bi bi-trash3-fill" style={{fontSize: "20px"}}></i>
                            </a>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
            
                <Tooltip anchorSelect=".edit-icon" place="bottom">
                    edit activity
                </Tooltip>
                <Tooltip anchorSelect=".delete-icon" place="bottom">
                    delete activity
                </Tooltip>
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

                <div className="deleteModal">
                    <Modal show={showDelete} onHide={handleCloseDelete} centered size="sm">
                        <Modal.Header closeButton className="text-center">
                        <Modal.Title className="w-100">Warning</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="text-center">
                            <p>Are you sure you want to delete the following conversion factor?</p>
                            <p><strong>This action cannot be undone</strong></p>
                        </div>
                        
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center" centered>
                        <Button variant="secondary" onClick={handleCloseDelete}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleCloseDelete}>
                            Delete
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </main>
        </div>
    ) : (
        handleProtect()
    );
}

export default UpdateFactors;

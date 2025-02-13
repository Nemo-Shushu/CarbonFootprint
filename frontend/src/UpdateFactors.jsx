import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Sidebar from "./Sidebar";
import "./static/UpdateFactors.css";
import { Tooltip } from 'react-tooltip';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function UpdateFactors() {
    const navigate = useNavigate();

    function handleProtect() {
        navigate("/sign-in")
    };

    const [conversionFactors, setConversionFactors] = useState([]);
    const [show, setShow] = useState(false);

    // used to populate and unpopulate modal popups
    const initialFactorValue = [
        { id: 0, name: "", value: 0}
    ];
    
    const [selectedFactor, setSelectedFactor] = useState(initialFactorValue);
    
    function handleClose() {
        setSelectedFactor({id: 0, name: "", value: 0});
        setShow(false);
    }
    
    function handleShow(id, name, value) {
        setSelectedFactor({id, name, value});
        setShow(true);
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

    useEffect(() => {
        getConversionFactors();
    }, []);


    return useAuth() ? (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 17%", }} />
            <main style={{flex: "1", padding: "1rem", overflowY: "auto",}} className="update-factors-container">
                <div class="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-8 align-middle">
                            <h2 className="text-start">Update Conversion Factors</h2>
                        </div>
                        <div class="col-6 col-md-3 text-end">
                        <Button onClick={() => handleShow(0, "", null)}>Add New Conversion Factor</Button>
                        </div>
                    </div>
                </div>

                <table className="table table-hover">
                    <thead>
                        <tr className="align-middle text-start">
                        <th scope="col" style={{width:"50%"}}>Activity</th>
                        <th scope="col" style={{width:"30%"}}>kg CO2e</th>
                        <th scope="col" style={{width:"20%"}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    {conversionFactors.map((factor) => (
                        <tr className="align-middle text-start">
                        <td>{factor.activity}</td>
                        <td>{factor.value}</td>
                        <td>
                            <a className="edit-icon me-5" onClick={() => handleShow(factor.id, factor.activity, factor.value)}>
                                <i className="bi bi-pen-fill" style={{fontSize: "20px"}}></i>
                            </a>
                            <a className="delete-icon me-5 text-danger">
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
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                        <Modal.Title>Edit Conversion Factor</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div class="input-group mb-3">
                            <label for="basic-url" class="form-label">Activity Name</label>
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder={selectedFactor.activity} aria-label="Recipient's username" aria-describedby="basic-addon2"></input>
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
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
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

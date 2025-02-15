import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../useAuth";
import Sidebar from "../../Sidebar";
import "./UpdateFactors.css";
import { Tooltip } from 'react-tooltip';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DeleteFactor from "./DeleteFactor";
import EditFactor from "./EditFactor";
import FactorTable from "./FactorTable";

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

    function handleShowCreate() {
        setModalTitle("Create a New");
        setShowEdit(true);
    }

    function handleShowEdit(id, name, value) {
        setModalTitle("Edit");
        setSelectedFactor({id, name, value});
        setShowEdit(true);
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

                <FactorTable
                    conversionFactors={conversionFactors}
                    showDelete={() => setShowDelete(true)}
                    handleShowEdit={handleShowEdit}
                ></FactorTable>

                <EditFactor
                    handleCloseEdit={handleCloseEdit}
                    showEdit={showEdit}
                    modalTitle={modalTitle}
                    selectedFactor={selectedFactor}
                ></EditFactor>
                
                <DeleteFactor
                    handleCloseDelete={() => setShowDelete(false)}
                    showDelete={showDelete}
                ></DeleteFactor>

                <Tooltip anchorSelect=".edit-icon" place="bottom">
                    edit activity
                </Tooltip>
                <Tooltip anchorSelect=".delete-icon" place="bottom">
                    delete activity
                </Tooltip>
                
            </main>
        </div>
    ) : (
        handleProtect()
    );
}

export default UpdateFactors;

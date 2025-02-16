import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../useAuth";
import Sidebar from "../../Sidebar";
import "./UpdateFactors.css";
import { Tooltip } from 'react-tooltip';
import Button from 'react-bootstrap/Button';
import DeleteFactor from "./DeleteFactor";
import EditFactor from "./EditFactor";
import FactorTable from "./FactorTable";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function UpdateFactors() {
    const navigate = useNavigate();

    useEffect(() => {
        getConversionFactors();
    }, []);

    const [conversionFactors, setConversionFactors] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const csrftoken = Cookies.get('csrftoken');
    
    // set title for the delete and edit modals
    const [modalTitle, setModalTitle] = useState("");

    // used to populate and unpopulate modal popups
    const initialFactorValue = [
        { id: 0, activity: "", value: 0}
    ];
    const [selectedFactor, setSelectedFactor] = useState(initialFactorValue);

    function handleProtect() {
        navigate("/sign-in")
    };
    
    function handleCloseEdit() {
        setSelectedFactor(initialFactorValue);
        setShowEdit(false);
    }

    function handleCloseCreate() {
        setSelectedFactor(initialFactorValue);
        setShowCreate(false);
    }

    function handleShowEdit(id, activity, value) {
        setModalTitle("Edit");
        setSelectedFactor({id, activity, value});
        setShowEdit(true);
    }

    function handleShowDelete(acitivtyId) {
        setSelectedFactor({id: acitivtyId, activity: "", value: 0});
        setShowDelete(true);
    }

    function handleShowCreate() {
        setModalTitle("Create a New");
        setSelectedFactor(initialFactorValue);
        setShowCreate(true);
    }

    async function getConversionFactors() {
        await fetch(backendUrl + 'api/accounts/conversion-factors/', {
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

    async function handleEditSubmission(event) {
        event.preventDefault();
        await fetch(backendUrl + 'api/accounts/conversion-factors/' + selectedFactor.id, {
            method: "PUT",
            credentials: "include",
            headers: {
                'content-type': 'application/json',
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(selectedFactor)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('failed to update conversion factors');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
            setConversionFactors(prevState => 
                prevState.map(item => 
                    item.id === data.id ? data : item
                )
            );
            console.log(conversionFactors.find(i => i.id === data.id));
          })
          .catch(err => {
            console.error('failed to update conversion factors', err);
        });
        setShowEdit(false);
    }

    async function handleCreateSubmission(event) {
        event.preventDefault();
        await fetch(backendUrl + 'api/accounts/conversion-factors/', {
            method: "POST",
            credentials: "include",
            headers: {
                'content-type': 'application/json',
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({activity: selectedFactor.activity, value: selectedFactor.value})
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('failed to create new conversion factor');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
            setConversionFactors(prevFactors => [...prevFactors, data]);
          })
          .catch(err => {
            console.error('failed to create conversion factors', err);
        });
        setShowCreate(false);
    }

    async function handleDeleteSubmission(event) {
        event.preventDefault();
        console.log(event);
        await fetch(backendUrl + 'api/accounts/conversion-factors/' + selectedFactor.id, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'content-type': 'application/json',
                "X-CSRFToken": csrftoken,
            },
        })
        .then(data => {
            console.log(data);
            setConversionFactors(conversionFactors.filter(row => selectedFactor.id !== row.id)
            );
          })
        .catch(err => {
            console.error('unable to delete specified conversion factor', err);
        });
        setShowDelete(false);
    }

    return useAuth() ? (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 17%", }} />
            <main style={{flex: "1", padding: "1rem", overflowY: "auto",}} className="update-factors-container">
                <div className="container-fluid">
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
                    showDelete={handleShowDelete}
                    handleShowEdit={handleShowEdit}
                ></FactorTable>

                <EditFactor
                    handleCloseEdit={handleCloseEdit}
                    showEdit={showEdit}
                    modalTitle={modalTitle}
                    selectedFactor={selectedFactor}
                    handleSubmit={handleEditSubmission}
                    setSelectedFactor={setSelectedFactor}
                ></EditFactor>

                // this modal is for creating new factors
                // rename in the future to increase readability
                <EditFactor
                    handleCloseEdit={handleCloseCreate}
                    showEdit={showCreate}
                    modalTitle={modalTitle}
                    selectedFactor={selectedFactor}
                    handleSubmit={handleCreateSubmission}
                    setSelectedFactor={setSelectedFactor}
                ></EditFactor>
                
                <DeleteFactor
                    handleCloseDelete={handleDeleteSubmission}
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

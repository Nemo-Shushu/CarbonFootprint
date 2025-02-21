import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../useAuth";
import Sidebar from "../../../Sidebar";
import "../assets/ManageFactors.css";
import { Tooltip } from 'react-tooltip';
import Button from 'react-bootstrap/Button';
import DeleteFactor from "./DeleteFactorModal";
import EditFactor from "./EditFactorModal";
import FactorTable from "./FactorTable";
import {
    getConversionFactors,
    handleUpdateSubmissionAPI,
    handleCreateSubmissionAPI,
    handleDeleteSubmissionAPI,
} from "../api/apiFactors";

function ManageFactors() {
    const navigate = useNavigate();

    useEffect(() => {
        getConversionFactors(setConversionFactors);
    }, []);

    const [conversionFactors, setConversionFactors] = useState([]);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    
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

    function handleCloseCreate() {
        setSelectedFactor(initialFactorValue);
        setShowCreate(false);
    }

    function handleCloseUpdate() {
        setSelectedFactor(initialFactorValue);
        setShowUpdate(false);
    }

    function handleShowUpdate(id, activity, value) {
        setModalTitle("Update");
        setSelectedFactor({id, activity, value});
        setShowUpdate(true);
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

    function handleUpdateSubmission(event) {
        handleUpdateSubmissionAPI(event, selectedFactor);
        setConversionFactors(prevState => 
            prevState.map(item => 
                item.id === selectedFactor.id ? selectedFactor : item
            )
        );
        setShowUpdate(false);
    }

    function handleCreateSubmission(event) {
        handleCreateSubmissionAPI(event, selectedFactor);
        setConversionFactors(prevFactors => [selectedFactor, ...prevFactors]);
        setShowCreate(false);
    }

    function handleDeleteSubmission(event) {
        handleDeleteSubmissionAPI(event, selectedFactor);
        setConversionFactors(conversionFactors.filter(row => selectedFactor.id !== row.id));
        setShowDelete(false);
    }

    return useAuth() ? (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 17%", }} />
            <main style={{flex: "1", padding: "1rem", overflowY: "auto",}} className="update-factors-container">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-8 align-middle" style={{paddingLeft: "0px"}}>
                            <h2 className="text-start">Manage Conversion Factors</h2>
                        </div>
                        <div className="col-6 col-md-4 text-end">
                        <Button onClick={handleShowCreate}>Add New Conversion Factor</Button>
                        </div>
                    </div>
                </div>

                <FactorTable
                    conversionFactors={conversionFactors}
                    showDelete={handleShowDelete}
                    handleShowEdit={handleShowUpdate}
                />

                <EditFactor
                    handleClose={handleCloseUpdate}
                    show={showUpdate}
                    modalTitle={modalTitle}
                    selectedFactor={selectedFactor}
                    handleSubmit={handleUpdateSubmission}
                    setSelectedFactor={setSelectedFactor}
                    buttonContents={"Save Changes"}
                />
                
                <EditFactor
                    handleClose={handleCloseCreate}
                    show={showCreate}
                    modalTitle={modalTitle}
                    selectedFactor={selectedFactor}
                    handleSubmit={handleCreateSubmission}
                    setSelectedFactor={setSelectedFactor}
                    buttonContents={"Create"}
                />
                
                <DeleteFactor
                    showDelete={showDelete}
                    handleDelete={handleDeleteSubmission}
                    handleClose={() => setShowDelete(false)}
                />

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

export default ManageFactors;

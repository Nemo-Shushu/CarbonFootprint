import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import './scss/custom.scss';
import './static/AdminTools.css';

function AdminTool() {
    const [selectedText, setSelectedText] = useState("");
    const [showPopUp, setShowPopUp] = useState(false);
    const [confirmationPopUp, setConfirmationPopUp] = useState(false);
    const [actionType, setActionType] = useState(""); 
    const [selectedRequest, setSelectedRequest] = useState(null);

    const data = [
        {
            id: 1,
            email: "user1@student.gla.ac.uk",
            text: "Please give me admin permissions, you can trust me Please give me admin permissions, you can trust me Please give me admin permissions, you can trust me Please give me admin permissions, you can trust me",
        },
        {
            id: 2,
            email: "user2@student.gla.ac.uk",
            text: "I need admin access to manage users",
        },
        {
            id: 3,
            email: "user3@student.gla.ac.uk",
            text: "Can you make me an admin?",
        },
    ];

    function handleTextClick(text) {
        setSelectedText(text);
        setShowPopUp(true);
    };

    function closePopUp() {
        setShowPopUp(false);
        setSelectedText("");
    };

    function handleActionClick(request, action) {
        setSelectedRequest(request); 
        setActionType(action);
        setConfirmationPopUp(true); 
    };

    function closeConfirmationPopUp() {
        setConfirmationPopUp(false);
        setSelectedRequest(null);
        setActionType("");
    };

    function confirmAction() {
        console.log('${actionType} action confirmed for request:', selectedRequest);
        closeConfirmationPopUp(); 
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* SideBar */}
            <Sidebar style={{ flex: "0 0 17%", }} />

            {/* Maincontent */}
            <main className="Main-context">
                <h2 className="mt-4">Admin Requests</h2>
                <div className="table-responsive small mt-3">
                    <table className="table table-striped table-sm">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: "5%" }}>Id</th>
                                <th style={{ width: "25%" }}>Email</th>
                                <th style={{ width: "50%" }}>Request Admin</th>
                                <th style={{ width: "20%" }}>Confirmation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row) => (
                                    <tr key={row.id} className="align-middle">
                                        <td>{row.id}</td>
                                        <td>{row.email}</td>
                                        <td 
                                        className="text-truncate ellipsis-text"
                                        onClick={() => handleTextClick(row.text)}
                                        onMouseEnter={(e) => (e.target.style.color = "blue")} 
                                        onMouseLeave={(e) => (e.target.style.color = "black")}
                                        > 
                                        {row.text} 
                                        </td>
                                        <td>
                                            <button className="btn btn-success me-2" type="button" onClick={() => handleActionClick(row, "Confirm")} 
                                            > Confirm </button>
                                            <button className="btn btn-danger" type="button" onClick={() => handleActionClick(row, "Deny")}
                                            > Deny </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        No requests available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* PoP-up */}
                {showPopUp && (
                    <>
                    <div className="modal-backdrop fade show"></div>
                    <div
                        className=" modal fade show"
                        style={{ display: "block", }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-lg centered-flex" >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Full Request Text</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={closePopUp} ></button>
                                </div>
                                <div className="modal-body overflow-auto text-wrap" style={{ maxHeight: "60vh", }}>
                                    <p>{selectedText}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closePopUp}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                )}

                {confirmationPopUp && (
                    <>
                    <div className="modal-backdrop fade show"></div>
                    <div
                        className=" modal fade show"
                        style={{ display: "block", }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-lg centered-flex">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Action</h5>
                                    <button type="button" className="btn-close" onClick={closeConfirmationPopUp}></button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        Are you sure you want to <strong>{actionType}</strong> the request from{" "}
                                        <strong>{selectedRequest?.email}</strong>?
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeConfirmationPopUp}>
                                        cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={confirmAction} >
                                        confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                )}

            </main>
        </div>
    );
};

export default AdminTool;
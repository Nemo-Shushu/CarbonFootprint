import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import './scss/custom.scss';

const AdminTool = () => {
    const [selectedText, setSelectedText] = useState("");
    const [showModal, setShowModal] = useState(false);
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

    const handleTextClick = (text) => {
        setSelectedText(text);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedText("");
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* SideBar */}
            <Sidebar style={{ flex: "0 0 17%", }} />

            {/* Maincontent */}
            <main style={{ flex: "1", padding: "1rem", overflowY: "auto" }}>
                <h2 className="mt-4">Admin Requests</h2>
                <div className="table-responsive small mt-3">
                    <table className="table table-striped table-sm">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: "5%" }}>ID</th>
                                <th style={{ width: "25%" }}>EMAIL</th>
                                <th style={{ width: "50%" }}>REQUEST TEXT</th>
                                <th style={{ width: "20%" }}>CONFIRMATION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row) => (
                                    <tr key={row.id} className="align-middle">
                                        <td>{row.id}</td>
                                        <td>{row.email}</td>
                                        <td style={{
                                            maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                            paddingRight: "50px", cursor: "pointer"
                                        }} onClick={() => handleTextClick(row.text)}> {row.text} </td>
                                        <td>
                                            <button className="btn btn-success me-2" type="button"> Confirm </button>
                                            <button className="btn btn-danger" type="button"> Deny </button>
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
                {showModal && (
                    <div
                        className="bg-background modal fade show"
                        style={{ display: "block", background: "#0000007c" }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-lg" style={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Full Request Text</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} ></button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "scroll", whiteSpace: "pre-wrap", }}>
                                    <p>{selectedText}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminTool;
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";

const AdminTool = () => {
    const data = [
        {
            id: 1,
            email: "user1@student.gla.ac.uk",
            text: "Please give me admin permissions, you can trust me aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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

    return (
        <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar style={{ flex: "0 0 17%",}}/>
        <main style={{ flex: "1", padding: "1rem", overflowY: "auto" }}>
            <h2 className="mt-4">Admin Requests</h2>
            <div className="table-responsive small mt-3">
                <table className="table table-striped table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th style={{width: "5%"}}>ID</th>
                            <th style={{width: "25%"}}>EMAIL</th>
                            <th style={{width: "50%"}}>REQUEST TEXT</th>
                            <th style={{width: "20%"}}>CONFIRMATION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row) => (
                                <tr key={row.id} className="align-middle">
                                    <td>{row.id}</td>
                                    <td>{row.email}</td>
                                    <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "50px"}}> {row.text} </td>
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
        </main>
        </div>
    );
};

export default AdminTool;

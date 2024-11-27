import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./static/RequestAdmin.css";

const RequestAdmin = () => {
    const navigate = useNavigate(); 

    const handleSubmit = () => {
        alert("Your request has been submitted!");
    };

    const handleBack = () => {
        navigate("/dashboard"); 
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
  
            <Sidebar style={{ flex: "0 0 15%", backgroundColor: "#385A4F" }} />
            
            <main className="request-admin-container">
                <h1>Request Admin</h1>
                <textarea
                    className="request-textarea"
                    placeholder="Enter your reason"
                ></textarea>
                <div className="button-group">
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleBack}
                    >
                        Back
                    </button>
                </div>
            </main>
        </div>
    );
};

export default RequestAdmin;

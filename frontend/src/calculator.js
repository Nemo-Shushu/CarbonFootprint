import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/dashboard.css";
import Sidebar from './Sidebar';
import "./static/Sidebar.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

let aggregate = 0;
//a const variable "report" will be here instead of aggregate. This variable will collect the data inputted by the user:
//at each page, handleChange will update a local variable, and handleSubmit will add the local variable to "report" global variable
//this way, we can avoid multiple calls to the backend, aggregate all information for the report here, without leaving Calculator() component, 
//and then handleSubmit it all on the last page

function Instructions() {

    const navigate = useNavigate();

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/utilities")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Instructions</h2>
            <h5>Use Calculator like that.</h5>
            <h6>{ aggregate }</h6>
            
            <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                <button type="button" class="btn btn-success" onClick={handleRoute}>Start</button>
            </div>
        </main>
    );
};

function Utilities() {

    const navigate = useNavigate();

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/travel")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Utilities</h2>

            <form className="needs-validation" noValidate>
                <div className="row g-2">
                    <div className="mt-5">
                        <strong>
                            Personnel:
                        </strong>
                    </div>

                    <hr/>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Number of FTE staff working on project</strong></label>
                        <input type="number" className="form-control" id="FTE-staff" placeholder="Enter number of people" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Total number of FTE research group members</strong></label>
                        <input type="number" className="form-control" id="FTE-members" placeholder="Enter number of people" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>
                    
                    <div className="mt-5">
                        <strong>
                            Type of space (for calculation of electricity and gas consumption):
                        </strong>
                    </div>

                    <hr/>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Academic laboratory</strong></label>
                        <input type="number" className="form-control" id="academic-laboratory-area" placeholder="Enter area in sq. ft." required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Admin office</strong></label>
                        <input type="number" className="form-control" id="admin-office-area" placeholder="Enter area in sq. ft." required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Academic office</strong></label>
                        <input type="number" className="form-control" id="academic-office-area" placeholder="Enter area in sq. ft." required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="mt-5">
                        <strong>
                            Type of space (for calculation of water consumption):
                        </strong>
                    </div>

                    <hr/>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Physical sciences laboratory</strong></label>
                        <input type="number" className="form-control" id="physical-laboratory-area" placeholder="Enter area in sq. ft." required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Engineering laboratory</strong></label>
                        <input type="number" className="form-control" id="engineering-laboratory-area" placeholder="Enter area in sq. ft." required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Medical/Life sciences laboratory</strong></label>
                        <input type="number" className="form-control" id="medical-laboratory-area" placeholder="Enter area in sq. ft." required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <label htmlFor="firstName" className="form-label"><strong>Office/Admin space</strong></label>
                        <input type="number" className="form-control" id="admin-space-area" placeholder="Enter area in sq. ft." required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                </div>
            </form>

            <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                <button type="button" class="btn btn-success" onClick={handleRoute}>Next</button>
            </div>
        </main>
    );
};

function Travel() {

    const navigate = useNavigate();

    const handleBack = () => {
        aggregate += 1
        navigate("/calculator/utilities")
    };

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/waste")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Travel</h2>
            <h6>{ aggregate }</h6>
            
            <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                <button type="button" class="btn btn-outline-secondary me-2" onClick={handleBack}>Back</button>
                <button type="button" class="btn btn-success" onClick={handleRoute}>Next</button>
            </div>
        </main>
    );
};

function Waste() {

    const navigate = useNavigate();

    const handleBack = () => {
        aggregate += 1
        navigate("/calculator/travel")
    };

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/procurement")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Waste</h2>
            <h6>{ aggregate }</h6>
            
            <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                <button type="button" class="btn btn-outline-secondary me-2" onClick={handleBack}>Back</button>
                <button type="button" class="btn btn-success" onClick={handleRoute}>Next</button>
            </div>
        </main>
    );
};

function Procurement() {

    const navigate = useNavigate();

    const handleBack = () => {
        aggregate += 1
        navigate("/calculator/waste")
    };

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/results")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Procurement</h2>
            <h6>{ aggregate }</h6>
            
            <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                <button type="button" class="btn btn-outline-secondary me-2" onClick={handleBack}>Back</button>
                <button type="button" class="btn btn-success" onClick={handleRoute}>Next</button>
            </div>
        </main>
    );
};

function Results() {

    const navigate = useNavigate();

    const handleBack = () => {
        aggregate += 1
        navigate("/calculator/procurement")
    };

    const handleSubmit = () => {
        aggregate = 0
        navigate("/dashboard")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Results</h2>
            <h6>{ aggregate }</h6>
            
            <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                <button type="button" class="btn btn-outline-secondary me-2" onClick={handleBack}>Back</button>
                <button type="button" class="btn btn-success" onClick={handleSubmit}>Submit</button>
            </div>
        </main>
    );
};

function Calculator() {
    return (    
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 20%", backgroundColor: "#385A4F" }} />
            <main style={{ flex: "1", padding: "1rem", maxWidth: "80%" }}>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <h1 className="h2">Calculator</h1>
                </div>
                <Routes>
                    <Route path="/" element={<Instructions />} />
                    <Route path="utilities" element={<Utilities />} />
                    <Route path="travel" element={<Travel />} />
                    <Route path="waste" element={<Waste />} />
                    <Route path="procurement" element={<Procurement />} />
                    <Route path="results" element={<Results />} />
                </Routes>
            </main>
        </div>
    );
}

export { Calculator };
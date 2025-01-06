import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/dashboard.css";
import Sidebar from './Sidebar';
import "./static/Sidebar.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CalculationBar from './CalculationBar';

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
            <form className="needs-validation" noValidate>
                <div className="row g-2">
                    <div className="mt-4 fst-italic">
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

                    <div className="col-sm-5">
                        <label htmlFor="firstName" className="form-label"><strong>Total number of FTE research group members</strong></label>
                        <input type="number" className="form-control" id="FTE-members" placeholder="Enter number of people" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>
                    
                    <div className="mt-4 fst-italic">
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

                    <div className="mt-4 fst-italic">
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

            <form className="needs-validation" noValidate>
                <div className="row g-2">

                    <div className="mt-4 fst-italic">
                        <strong>
                            Air travel
                        </strong>
                    </div>
                    <hr/>

                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Economy short-haul, to/from UK</strong></label>
                            <input type="number" className="form-control" id="air-eco-short" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Business short-haul, to/from UK</strong></label>
                            <input type="number" className="form-control" id="air-business-short" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Economy long-haul, to/from UK</strong></label>
                            <input type="number" className="form-control" id="air-eco-long" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Business long-haul, to/from UK</strong></label>
                            <input type="number" className="form-control" id="air-business-long" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Economy international, to/from non-UK</strong></label>
                            <input type="number" className="form-control" id="air-eco-inter" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Business international, to/from non-UK</strong></label>
                            <input type="number" className="form-control" id="air-business-inter" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 fst-italic">
                        <strong>
                            Sea travel
                        </strong>
                    </div>
                    <hr/>

                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Ferry</strong></label>
                            <input type="number" className="form-control" id="sea-ferry" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 fst-italic">
                        <strong>
                            Land travel
                        </strong>
                    </div>
                    <hr/>

                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Car</strong></label>
                            <input type="number" className="form-control" id="land-car" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Motorbike</strong></label>
                            <input type="number" className="form-control" id="land-motor" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Taxis</strong></label>
                            <input type="number" className="form-control" id="land-taxis" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Local Bus</strong></label>
                            <input type="number" className="form-control" id="land-bus" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Coach</strong></label>
                            <input type="number" className="form-control" id="land-coach" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>National rail</strong></label>
                            <input type="number" className="form-control" id="land-national-rail" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>International rail</strong></label>
                            <input type="number" className="form-control" id="land-inter-rail" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Light rail and tram</strong></label>
                            <input type="number" className="form-control" id="land-light-rail" placeholder="Enter number of distance(km)" required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>
                    </div>


                </div>
            </form>
            
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
            <form className="needs-validation" noValidate>
                <div className="row g-2">

                    <div className="mt-4 fst-italic">
                        <strong>
                            Recycling
                        </strong>
                    </div>
                    <hr/>

                    <div className="col-sm-3">
                        <label htmlFor="firstName" className="form-label"><strong>Mixed recycling</strong></label>
                        <input type="number" className="form-control" id="mixed-recycle" placeholder="Enter waste in tonne" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <label htmlFor="firstName" className="form-label"><strong>WEEE mixed recycling</strong></label>
                        <input type="number" className="form-control" id="WEEEmixed-recycle" placeholder="Enter waste in tonne" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="mt-4 fst-italic">
                        <strong>
                            Waste
                        </strong>
                    </div>
                    <hr/>

                    <div className="col-sm-3">
                        <label htmlFor="firstName" className="form-label"><strong>General waste</strong></label>
                        <input type="number" className="form-control" id="general-waste" placeholder="Enter waste in tonne" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <label htmlFor="firstName" className="form-label"><strong>Clinical waste</strong></label>
                        <input type="number" className="form-control" id="clinical-waste" placeholder="Enter waste in tonne" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <label htmlFor="firstName" className="form-label"><strong>Chemical waste</strong></label>
                        <input type="number" className="form-control" id="chemical-waste" placeholder="Enter waste in tonne" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <label htmlFor="firstName" className="form-label"><strong>Biological waste</strong></label>
                        <input type="number" className="form-control" id="bio-waste" placeholder="Enter waste in tonne" required />
                        <div className="invalid-feedback">
                        Valid number is required.
                        </div>
                    </div>

                </div>
            </form>
            
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
                <CalculationBar />
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
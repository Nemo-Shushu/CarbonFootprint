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

function PageZero() {

    const navigate = useNavigate();

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/page-one")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Instructions</h2>
            <h5>Use Calculator like that.</h5>
            <h6>{ aggregate }</h6>
            
            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button" onClick={handleRoute}>
                Start
            </button>
        </main>
    );
};

function PageOne() {

    const navigate = useNavigate();

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/page-two")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Page One</h2>
            <h6>{ aggregate }</h6>

            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button" onClick={handleRoute}>
                Next Page
            </button>
        </main>
    );
};

function PageTwo() {

    const navigate = useNavigate();

    const handleRoute = () => {
        aggregate += 1
        navigate("/calculator/page-three")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Page Two</h2>
            <h6>{ aggregate }</h6>
            
            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button" onClick={handleRoute}>
                Next Page
            </button>
        </main>
    );
};

function PageThree() {

    const navigate = useNavigate();

    const handleRoute = () => {
        aggregate = 0
        navigate("/dashboard")
    };

    return (
        <main class="ms-sm-auto px-md-4">
            <h2>Page Three</h2>
            <h6>{ aggregate }</h6>
            
            <button className="btn btn-outline-success w-100 py-2 mt-2" type="button" onClick={handleRoute}>
                Submit
            </button>
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
                    <Route path="/" element={<PageZero />} />
                    <Route path="page-one" element={<PageOne />} />
                    <Route path="page-two" element={<PageTwo />} />
                    <Route path="page-three" element={<PageThree />} />
                </Routes>
            </main>
        </div>
    );
}

export { Calculator };
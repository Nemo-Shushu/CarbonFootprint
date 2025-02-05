import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/dashboard.css";
import Sidebar from './Sidebar';
import "./static/Sidebar.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CalculationBar from './CalculationBar';
import procurementCategories from "./static/procurementCategories.json";

function Calculator() {

    const [report, setReport] = useState({});

    const navigate = useNavigate();

    const handleProtect = () => {
        navigate("/sign-in")
    };

    async function submitReport(report) {
        return fetch('http://localhost:8000/api/calculator/createreport/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        })
        .then(response => response.json())
        .then(data => console.log('Report submitted:', data))
        .catch(error => console.error('Error submitting report:', error));
    }

    function Instructions() {

        const navigate = useNavigate();

        const handleRoute = () => {
            navigate("/calculator/utilities")
        };

        return (
            <main class="ms-sm-auto px-md-4">
                <h2>Instructions</h2>
                <h5>Use Calculator like that. Click "Next" to save your inputs.</h5>
                
                <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                    <button type="button" class="btn btn-success" onClick={handleRoute}>Start</button>
                </div>
            </main>
        );
    };

    function Utilities() {

        const navigate = useNavigate();
        const [utilitiesReport, setUtilitiesReport] = useState({});
        useEffect(() => {
            if (typeof report["utilities"] !== "undefined") {
              setUtilitiesReport(report["utilities"]);
            }
        }, [report["utilities"]]);

        const handleRoute = () => {
            setReport(prevReport => ({ ...prevReport, ['utilities']: utilitiesReport }));
            navigate("/calculator/travel");
        };

        const handleChange = (event) => {
            const { name, value } = event.target;
            setUtilitiesReport(prevReport => ({ ...prevReport, [name]: value }));
        };

        return (
            <main class="ms-sm-auto px-md-4">
                {/* {JSON.stringify(utilitiesReport, null, 2)} */}
                <form className="needs-validation" noValidate>
                    <div className="row g-2">
                        <div className="mt-4 fst-italic">
                            <strong>
                                Personnel:
                            </strong>
                        </div>
                        <hr/>
                        
                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Number of FTE staff working on project</strong></label>
                                <input type="number" className="form-control" name="FTE-staff" placeholder="Enter number of people" value={utilitiesReport["FTE-staff"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-5">
                                <label htmlFor="firstName" className="form-label"><strong>Total number of FTE research group members</strong></label>
                                <input type="number" className="form-control" name="FTE-members" placeholder="Enter number of people" value={utilitiesReport["FTE-members"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4 fst-italic">
                            <strong>
                                Type of space (for calculation of electricity and gas consumption):
                            </strong>
                        </div>
                        <hr/>

                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Academic laboratory</strong></label>
                                <input type="number" className="form-control" name="academic-laboratory-area" placeholder="Enter area in sq. ft." value={utilitiesReport["academic-laboratory-area"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Admin office</strong></label>
                                <input type="number" className="form-control" name="admin-office-area" placeholder="Enter area in sq. ft." value={utilitiesReport["admin-office-area"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Academic office</strong></label>
                                <input type="number" className="form-control" name="academic-office-area" placeholder="Enter area in sq. ft." value={utilitiesReport["academic-office-area"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 fst-italic">
                            <strong>
                                Type of space (for calculation of water consumption):
                            </strong>
                        </div>
                        <hr/>

                        <div className="row mb-2">
                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Physical sciences laboratory</strong></label>
                                <input type="number" className="form-control" name="physical-laboratory-area" placeholder="Enter area in sq. ft." value={utilitiesReport["physical-laboratory-area"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Engineering laboratory</strong></label>
                                <input type="number" className="form-control" name="engineering-laboratory-area" placeholder="Enter area in sq. ft." value={utilitiesReport["engineering-laboratory-area"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Medical/Life sciences laboratory</strong></label>
                                <input type="number" className="form-control" name="medical-laboratory-area" placeholder="Enter area in sq. ft." value={utilitiesReport["medical-laboratory-area"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Office/Admin space</strong></label>
                                <input type="number" className="form-control" name="admin-space-area" placeholder="Enter area in sq. ft." value={utilitiesReport["admin-space-area"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
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
        const [travelReport, setTravelReport] = useState({});
        useEffect(() => {
            if (typeof report["travel"] !== "undefined") {
              setTravelReport(report["travel"]);
            }
        }, [report["travel"]]);

        const handleBack = () => {
            navigate("/calculator/utilities")
        };

        const handleRoute = () => {
            setReport(prevReport => ({ ...prevReport, ['travel']: travelReport }));
            navigate("/calculator/waste");
        };

        const handleChange = (event) => {
            const { name, value } = event.target;
            setTravelReport(prevReport => ({ ...prevReport, [name]: value }));
        };

        return (
            <main class="ms-sm-auto px-md-4">
                {/* {JSON.stringify(travelReport, null, 2)} */}
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
                                <input type="number" className="form-control" name="air-eco-short" placeholder="Enter number of distance(km)" value={travelReport["air-eco-short"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Business short-haul, to/from UK</strong></label>
                                <input type="number" className="form-control" name="air-business-short" placeholder="Enter number of distance(km)" value={travelReport["air-business-short"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Economy long-haul, to/from UK</strong></label>
                                <input type="number" className="form-control" name="air-eco-long" placeholder="Enter number of distance(km)" value={travelReport["air-eco-long"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Business long-haul, to/from UK</strong></label>
                                <input type="number" className="form-control" name="air-business-long" placeholder="Enter number of distance(km)" value={travelReport["air-business-long"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Economy international, to/from non-UK</strong></label>
                                <input type="number" className="form-control" name="air-eco-inter" placeholder="Enter number of distance(km)" value={travelReport["air-eco-inter"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Business international, to/from non-UK</strong></label>
                                <input type="number" className="form-control" name="air-business-inter" placeholder="Enter number of distance(km)" value={travelReport["air-business-inter"]} onChange={handleChange} required />
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
                                <input type="number" className="form-control" name="sea-ferry" placeholder="Enter number of distance(km)" value={travelReport["sea-ferry"]} onChange={handleChange} required />
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
                                <input type="number" className="form-control" name="land-car" placeholder="Enter number of distance(km)" value={travelReport["land-car"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Motorbike</strong></label>
                                <input type="number" className="form-control" name="land-motor" placeholder="Enter number of distance(km)" value={travelReport["land-motor"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Taxis</strong></label>
                                <input type="number" className="form-control" name="land-taxis" placeholder="Enter number of distance(km)" value={travelReport["land-taxis"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Local Bus</strong></label>
                                <input type="number" className="form-control" name="land-bus" placeholder="Enter number of distance(km)" value={travelReport["land-bus"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Coach</strong></label>
                                <input type="number" className="form-control" name="land-coach" placeholder="Enter number of distance(km)" value={travelReport["land-coach"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>National rail</strong></label>
                                <input type="number" className="form-control" name="land-national-rail" placeholder="Enter number of distance(km)" value={travelReport["land-national-rail"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>International rail</strong></label>
                                <input type="number" className="form-control" name="land-inter-rail" placeholder="Enter number of distance(km)" value={travelReport["land-inter-rail"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-4">
                                <label htmlFor="firstName" className="form-label"><strong>Light rail and tram</strong></label>
                                <input type="number" className="form-control" name="land-light-rail" placeholder="Enter number of distance(km)" value={travelReport["land-light-rail"]} onChange={handleChange} required />
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
        const [wasteReport, setWasteReport] = useState({});
        useEffect(() => {
            if (typeof report["waste"] !== "undefined") {
              setWasteReport(report["waste"]);
            }
        }, [report["waste"]]);

        const handleBack = () => {
            navigate("/calculator/travel")
        };

        const handleRoute = () => {
            setReport(prevReport => ({ ...prevReport, ['waste']: wasteReport }));
            navigate("/calculator/procurement")
        };

        const handleChange = (event) => {
            const { name, value } = event.target;
            setWasteReport(prevReport => ({ ...prevReport, [name]: value }));
        };

        return (
            <main class="ms-sm-auto px-md-4">
                {/* {JSON.stringify(wasteReport, null, 2)} */}
                <form className="needs-validation" noValidate>
                    <div className="row g-2">

                        <div className="mt-4 fst-italic">
                            <strong>
                                Recycling
                            </strong>
                        </div>
                        <hr/>

                        <div className="row mb-2">
                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Mixed recycling</strong></label>
                                <input type="number" className="form-control" name="mixed-recycle" placeholder="Enter waste in tonne" value={wasteReport["mixed-recycle"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        

                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>WEEE mixed recycling</strong></label>
                                <input type="number" className="form-control" name="WEEEmixed-recycle" placeholder="Enter waste in tonne" value={wasteReport["WEEEmixed-recycle"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 fst-italic">
                            <strong>
                                Waste
                            </strong>
                        </div>
                        <hr/>

                        <div className="row mb-2">
                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>General waste</strong></label>
                                <input type="number" className="form-control" name="general-waste" placeholder="Enter waste in tonne" value={wasteReport["general-waste"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Clinical waste</strong></label>
                                <input type="number" className="form-control" name="clinical-waste" placeholder="Enter waste in tonne" value={wasteReport["clinical-waste"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Chemical waste</strong></label>
                                <input type="number" className="form-control" name="chemical-waste" placeholder="Enter waste in tonne" value={wasteReport["chemical-waste"]} onChange={handleChange} required />
                                <div className="invalid-feedback">
                                Valid number is required.
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <label htmlFor="firstName" className="form-label"><strong>Biological waste</strong></label>
                                <input type="number" className="form-control" name="bio-waste" placeholder="Enter waste in tonne" value={wasteReport["bio-waste"]} onChange={handleChange} required />
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

    function Procurement() {

        const navigate = useNavigate();
        const [procurementReport, setProcurementReport] = useState({});
        useEffect(() => {
            if (typeof report["procurement"] !== "undefined") {
              setProcurementReport(report["procurement"]);
            }
        }, [report["procurement"]]);

        const [rowVisibility, setRowVisibility] = useState({});
        const [currentRow, setCurrentRow] = useState(0);
        const [rowCategory, setRowCategory] = useState({});
        const [categorySelected, setCategorySelected] = useState({});
        const rows = Array.from({ length: 400 }, (_, i) => i);

        const handleRevealRow = () => {
            setCurrentRow(currentRow + 1);
            setRowVisibility((prevVisibility) => ({
                ...prevVisibility,
                [currentRow]: true,
            }));
        }

        const handleCategoryChange = (event) => {
            const selectedValue = event.target.value;
            const rowNum = event.target.closest('tr').id;
        
            setRowCategory((prevRowCategory) => ({
                ...prevRowCategory,
                [rowNum]: selectedValue
            }));

            setCategorySelected((prevCategorySelected) => ({
                ...prevCategorySelected,
                [selectedValue]: true,
            }));
        };

        const handleBack = () => {
            navigate("/calculator/waste");
        };

        const handleRoute = () => {
            setReport(prevReport => ({ ...prevReport, ["procurement"]: procurementReport }));
            navigate("/calculator/results");
        };

        const handleProcurementDelete = (num) => {
            setProcurementReport((prevReport) => {
                const updatedReport = { ...prevReport };
                delete updatedReport[rowCategory[num]];
                return updatedReport;
            });
        
            setRowVisibility((prevVisibility) => ({
                ...prevVisibility,
                [num]: false,
            }));

            setCategorySelected((prevCategorySelected) => ({
                ...prevCategorySelected,
                [rowCategory[num]]: false,
            }));
        };

        const handleProcurementChange = (event) => {
            const { name, value } = event.target;
            setProcurementReport(prevReport => ({ ...prevReport, [name]: value }));
        };

        return (
            <main class="d-flex flex-column min-vh-100 ms-sm-auto px-md-4">
                {JSON.stringify(procurementReport, null, 2)}
                {currentRow}
                {JSON.stringify(rowVisibility, null, 2)}
                <h2>Procurement</h2>
                
                <button className="btn btn-light text-moss fs-1" onClick={handleRevealRow}>
                    +
                </button>

                <div class="table-responsive small mt-3">
                    <table class="table table-light table-sm">
                    <thead>
                        <tr className="align-middle text-center">
                        <th scope="col">category</th>
                        <th scope="col">value</th>
                        <th scope="col">delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {rows.map((num) => (
                        <tr key={num} id={num} className={rowVisibility[num] ? 'align-middle text-center' : 'd-none align-middle text-center'}>
                        <td>
                            <select className="form-select form-select-sm" aria-label=".form-select-lg example" onChange={handleCategoryChange} disabled={rowCategory[num] !== undefined}>
                                <option selected disabled="true">Select a procurement category</option>
                                {procurementCategories.map((category) => (
                                    <option value={category.code} disabled={categorySelected[category.code]}>{category.code} - {category.name}{categorySelected[category.code] && category.code != rowCategory[num] ? " - SELECTED" : ''}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input type="number" className="form-control form-control-sm" disabled={rowCategory[num] === undefined} name={rowCategory[num]} placeholder="Enter amount spent in GBP" value={procurementReport[rowCategory[num]] ?? ''} onChange={handleProcurementChange} required />
                        </td>
                        <td>
                            <button className="btn btn-outline-danger w-30" type="button" onClick={() => handleProcurementDelete(num)}>Delete</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
                
                <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={handleBack}>Back</button>
                    <button type="button" className="btn btn-success" onClick={handleRoute}>Next</button>
                </div>
            </main>
        );
    };

    function Results() {

        const navigate = useNavigate();

        const handleBack = () => {
            navigate("/calculator/procurement")
        };

        const handleRoute = () => {
            navigate("/dashboard")
        };

        return (
            <main class="ms-sm-auto px-md-4">
                <h2>Results</h2>
                
                <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                    <button type="button" class="btn btn-outline-secondary me-2" onClick={handleBack}>Back</button>
                    <button type="button" class="btn btn-success" onClick={handleRoute}>Submit</button>
                </div>
            </main>
        );
    };


    return useAuth() ? (    
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 17%",}} />
            <main style={{flex: "1", padding: "1rem", overflowY: "auto",}}>
                <CalculationBar />
                {/* {JSON.stringify(report, null, 2)} */}
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
    ) : (
        handleProtect()
    );
}

export { Calculator };
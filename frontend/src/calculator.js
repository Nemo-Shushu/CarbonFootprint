import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./static/dashboard.css";
import Sidebar from './Sidebar';
import "./static/Sidebar.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CalculationBar from './CalculationBar';

function Calculator() {

    const [report, setReport] = useState({});

    function Instructions() {

        const navigate = useNavigate();

        const handleRoute = () => {
            //reset the report variable to start again
            navigate("/calculator/utilities")
        };

        return (
            <main class="ms-sm-auto px-md-4">
                <h2>Instructions</h2>
                <h5>Use Calculator like that.</h5>
                
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
                {JSON.stringify(utilitiesReport, null, 2)}
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
                        
                        <div className="mt-4 fst-italic">
                            <strong>
                                Type of space (for calculation of electricity and gas consumption):
                            </strong>
                        </div>

                        <hr/>

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

                        <div className="mt-4 fst-italic">
                            <strong>
                                Type of space (for calculation of water consumption):
                            </strong>
                        </div>

                        <hr/>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Physical sciences laboratory</strong></label>
                            <input type="number" className="form-control" name="physical-laboratory-area" placeholder="Enter area in sq. ft." value={utilitiesReport["physical-laboratory-area"]} onChange={handleChange} required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Engineering laboratory</strong></label>
                            <input type="number" className="form-control" name="engineering-laboratory-area" placeholder="Enter area in sq. ft." value={utilitiesReport["engineering-laboratory-area"]} onChange={handleChange} required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Medical/Life sciences laboratory</strong></label>
                            <input type="number" className="form-control" name="medical-laboratory-area" placeholder="Enter area in sq. ft." value={utilitiesReport["medical-laboratory-area"]} onChange={handleChange} required />
                            <div className="invalid-feedback">
                            Valid number is required.
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label htmlFor="firstName" className="form-label"><strong>Office/Admin space</strong></label>
                            <input type="number" className="form-control" name="admin-space-area" placeholder="Enter area in sq. ft." value={utilitiesReport["admin-space-area"]} onChange={handleChange} required />
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
                {JSON.stringify(travelReport, null, 2)}
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
                {JSON.stringify(wasteReport, null, 2)}
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

                        <div className="mt-4 fst-italic">
                            <strong>
                                Waste
                            </strong>
                        </div>
                        <hr/>

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

        const [category, setCategory] = useState('');
        const [visible, setVisible] = useState("invisible col-sm-3");

        const handleCategoryChange = (event) => {
            let eventValue = event.target.value;
            setCategory(eventValue);
            setVisible("visible col-sm-3");
        };

        const handleBack = () => {
            navigate("/calculator/waste");
        };

        const handleRoute = () => {
            setReport(prevReport => ({ ...prevReport, ["procurement"]: procurementReport }));
            navigate("/calculator/results");
        };

        const handleProcurementChange = (event) => {
            const { name, value } = event.target;
            setProcurementReport(prevReport => ({ ...prevReport, [name]: value }));
        };

        return (
            <main class="ms-sm-auto px-md-4">
                {JSON.stringify(procurementReport, null, 2)}
                <h2>Procurement</h2>
                <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example" onChange={handleCategoryChange}>
                    <option selected disabled="disabled">Select a procurement category</option>
                    <option value="A">Audio Visual & Multimedia Supplies and Services</option>
                    <option value="AA">Audio Visual Equipment purchase</option>
                    <option value="AB">Display and Projection Equipment and Consumables</option>
                    <option value="AC">AV Learning and Training Packs</option>
                    <option value="AD">Music Instruments, Scores, Purchase, Maintenance</option>
                    <option value="AE">Photographic Equipment Supplies and Services</option>
                    <option value="AF">Studio Hire and Running Costs</option>
                    <option value="AG">Theatre Production Consumables (scenery, lighting, props, costumes)</option>
                    <option value="AH">Video Equipment Purchase hire and Maintenance and repair</option>
                    <option value="AJ">Audio Visual Consumables, Accessories</option>
                    <option value="AK">Photographic Consumables, Accessories etc</option>
                    <option value="AL">Digital Imaging Equipment Purchase, Maintenance, Repair and Consumables</option>
                    <option value="AM">Commercial and Graphic Art Equipment Purchase and Maintenance and Consumables</option>
                    <option value="AN">External Production Services (Performances, Tours)</option>
                    <option value="AP">Tape Machines, Video Interviewing Equipment</option>
                    <option value="AQ">Website Design and Services SUSPENDED</option>
                    <option value="AR">Fine and Creative Arts, Equipment Purchase, Maintenance, Consumables</option>
                    <option value="AT">Audio-Visual Equipment Hire</option>
                    <option value="AU">Audio visual Equipment Maintenance and Services</option>
                    <option value="AZ">Other and General Audio-Visual Aids</option>
                    <option value="B">Library & Publications</option>
                    <option value="BA">Book Binding Services</option>
                    <option value="BB">Books Hardcopy</option>
                    <option value="BC">Inter-Library Loans</option>
                    <option value="BD">Journals Hardcopy</option>
                    <option value="BE">Library Subscriptions</option>
                    <option value="BF">Manuscripts Hardcopy</option>
                    <option value="BG">Newspapers and Periodicals Hardcopy</option>
                    <option value="BI">Manuscripts Electronic</option>
                    <option value="BJ">Microfiche equipment and consumables</option>
                    <option value="BK">Electronic Publications, Media and Music</option>
                    <option value="BL">Manuals; Computer, Workshop, Training</option>
                    <option value="BM">Tickets and Tokens (including electronic tickets and book tokens)</option>
                    <option value="BN">Library Equipment and Services (e.g. book tagging) including maintenance, repair and hire</option>
                    <option value="BP">Books Electronic</option>
                    <option value="BQ">Journal Electronics</option>
                    <option value="BR">Newspapers and Periodicals Electronic</option>
                    <option value="BS">Library Licences, Royalties, Open Access Charges, Author Fees</option>
                    <option value="BT">Library Materials Restoration</option>
                    <option value="BV">Maps Electronic or Hardcopy</option>
                    <option value="BW">Sheet Music</option>
                    <option value="BZ">Other and General Library</option>
                    <option value="C">Catering Supplies & Services</option>
                    <option value="CA">Alcoholic drinks</option>
                    <option value="CB">Bakery Products</option>
                    <option value="CC">Dairy Produce</option>
                    <option value="CD">Frozen Foods</option>
                    <option value="CE">Groceries</option>
                    <option value="CF">Catering and Bar Equipment and Accessories purchases</option>
                    <option value="CG">Catering and Bar Equipment Maintenance and Repair</option>
                    <option value="CH">Meat, Poultry, Offal</option>
                    <option value="CJ">Non-alcoholic drinks</option>
                    <option value="CK">Tableware, Crockery, Cutlery, Table Coverings etc. Inc. Disposables</option>
                    <option value="CL">Vending Equipment, Consumables and Charges</option>
                    <option value="CM">Fresh Fruit and Vegetables</option>
                    <option value="CN">Table and Room Decorations</option>
                    <option value="CP">Fish and Seafood</option>
                    <option value="CQ">Confectionary</option>
                    <option value="CR">Watercooler Equipment, Services and Consumables</option>
                    <option value="CS">Catering Entertainments</option>
                    <option value="CT">Catering Services, Outsourced, incl Pre-prepared Meals</option>
                    <option value="CU">Catering Hospitality</option>
                    <option value="CV">Liquor Licences</option>
                    <option value="CY">Tobacco</option>
                    <option value="CZ">Other and General Catering</option>
                    <option value="D">Medical, Surgical, Nursing, Dentistry Supplies & Services</option>
                    <option value="DA">Medical Capital Equipment</option>
                    <option value="DB">Medical, Small Apparatus, Equipment and Instruments</option>
                    <option value="DC">Medical, Consumables and Disposables</option>
                    <option value="DD">Medical, Surgical, Nursing, Dressing and Bandages</option>
                    <option value="DE">Medical, Specialist Clothing</option>
                    <option value="DF">Medical Equipment Maintenance and Repair</option>
                    <option value="DG">Waste Disposal Clinical SUSPENDED</option>
                    <option value="DH">Medical Patient Diagnostic Services and Clinical Trials</option>
                    <option value="DJ">Medical Teaching materials and aids</option>
                    <option value="DK">Physiotherapy and Sports Science Equipment and Consumables</option>
                    <option value="DL">Medicinal Drugs - Non Veterinary</option>
                    <option value="DZ">Other and General</option>
                    <option value="E">Agricultural/ Fisheries/ Forestry/ Horticultural/ Oceanographic Supplies & Services</option>
                    <option value="EA">Livestock and Animal Purchase, Services and Supplies</option>
                    <option value="EB">Livestock, Animal and Farm Feeds</option>
                    <option value="EC">Agricultural, Fisheries, Forestry, Oceanographic Capital Equipment</option>
                    <option value="ED">Agricultural, Fisheries, Forestry, Oceanographic, Small Equipment and Tools</option>
                    <option value="EF">Agricultural Equipment Maintenance and Repair</option>
                    <option value="EG">Agricultural Equipment Hire</option>
                    <option value="EH">Purchase of Plants, Crops, Trees etc.</option>
                    <option value="EJ">Animal Welfare services</option>
                    <option value="EK">Fertilisers, Pesticides, Composts, Soils</option>
                    <option value="EL">Agricultural Fencing Supplies and Associated Services</option>
                    <option value="EM">Horticultural Consumables (Pots, Seed, Trays)</option>
                    <option value="EN">Oceanographic Supplies and Services</option>
                    <option value="EP">Housing - Kennels, Catteries, Stabling, bedding and tackle Supplies and Services</option>
                    <option value="ER">Spare</option>
                    <option value="ES">Pasturage maintenance</option>
                    <option value="ET">Medicinal Products - Drugs Veterinary</option>
                    <option value="EZ">Agricultural, Fisheries, Forestry, Horticultural, Oceanographic, Geology: Other and General</option>
                    <option value="F">Furniture, Furnishings & textiles</option>
                    <option value="FA">Electrical White Goods and Domestic Kitchen Equipment</option>
                    <option value="FB">Laboratory Furniture - Fixed and Free-standing</option>
                    <option value="FC">Furniture - Office</option>
                    <option value="FD">Floor Coverings</option>
                    <option value="FE">Textiles, Fabrics, Soft and Loose Furnishings</option>
                    <option value="FF">Furniture - Residential</option>
                    <option value="FG">Window Coverings</option>
                    <option value="FH">Sports, Recreational and Nursery Materials and Equipment</option>
                    <option value="FJ">Furniture - Removal and Storage</option>
                    <option value="FK">Furniture - Repairs</option>
                    <option value="FL">Furniture - Classroom and Lecture Theatre</option>
                    <option value="FM">Drama Production Requisites</option>
                    <option value="FN">General Storage, Racking, Shelving (incl. Library excl Labs)</option>
                    <option value="FO">Boards, Notice, Pin, Chalk, Easels, Mirrors</option>
                    <option value="FP">Security Furniture (Inc. Safes)</option>
                    <option value="FQ">Clocks and Timepieces</option>
                    <option value="FR">Office Seating</option>
                    <option value="FS">Hair and Beauty Equipment, services, suppliers Purchase, maintenance and repair</option>
                    <option value="FT">Outdoor furniture</option>
                    <option value="FU">Furniture and Furnishings Purchase - Specialist</option>
                    <option value="FZ">Other and General Furniture, Furnishings and Textiles</option>
                    <option value="G">Sports, Sports Science and Recreation</option>
                    <option value="GA">Sports and Recreational Equipment Purchase</option>
                    <option value="GB">Sports Capital Purchases</option>
                    <option value="GC">Sports Equipment - Maintenance & Repair</option>
                    <option value="GD">Sports Equipment - Hire & Lease</option>
                    <option value="GE">Sports Equipment - Consumables and accessories purchase</option>
                    <option value="GF">Sports Clothing</option>
                    <option value="GG">Sports Services (incl. coaching)</option>
                    <option value="GH">Sports Science Equipment Hire maintenance and Service</option>
                    <option value="GJ">Sports Science Equipment, accessories and consumables Purchase</option>
                    <option value="H">Janitorial & Domestic Supplies & Services</option>
                    <option value="HA">Detergents</option>
                    <option value="HB">Cleaning Machines and Maintenance</option>
                    <option value="HC">Gloves, Cleaning and Industrial</option>
                    <option value="HD">Washroom Services and Vending Supplies and Services</option>
                    <option value="HE">Paper Disposables</option>
                    <option value="HF">Protective Clothing and Safety Workwear</option>
                    <option value="HG">Laundry and Dry Cleaning Services and Equipment</option>
                    <option value="HH">Washroom and Cleaning Consumables</option>
                    <option value="HJ">Janitorial and Domestic: Washing Materials</option>
                    <option value="HK">Janitorial and Domestic: Waste Sacks and Bags</option>
                    <option value="HL">Disinfectants</option>
                    <option value="HN">Soaps</option>
                    <option value="HP">Dusting and Polishing Consumables (Rags, Brushes, Mops)</option>
                    <option value="HQ">Window Cleaning</option>
                    <option value="HR">Janitorial Clothing and Tailoring Supplies and Services</option>
                    <option value="HS">Footwear Supplies</option>
                    <option value="HZ">Other and General Cleaning and Janitorial</option>
                    <option value="JF">Steam Trading</option>
                    <option value="JG">Carbon Emissions Trading</option>
                    <option value="JH">CHP plant maintenance</option>
                    <option value="JJ">Renewable Energy (Fit,Rhi) Equipment</option>
                    <option value="JZ">Other/General Utilities</option>
                    <option value="K">Computer Supplies & Services</option>
                    <option value="KB">Printer Purchase, Maintenance and repair</option>
                    <option value="KC">Printer Consumables, Toners, Ink, Ribbons etc</option>
                    <option value="KD">Magnetic Media and Storage, Optical Media and Storage</option>
                    <option value="KE">IT Software including Bespoke Licences Maintenance</option>
                    <option value="KF">Workstation and Mini-computer Purchase and Maintenance</option>
                    <option value="KG">Server, Storage and Networking equipment Purchase</option>
                    <option value="KH">Desktop, Laptop, Tablet Purchase inc. Apple</option>
                    <option value="KI">EPOS and PDQ machines</option>
                    <option value="KJ">Server and Networking Equipment Installation and Maintenance</option>
                    <option value="KK">Portable and Laptop Computer Purchase and Maintenance</option>
                    <option value="KL">Plotter and Scanner Purchase and Maintenance</option>
                    <option value="KM">Computer Consumables & Peripherals</option>
                    <option value="KN">Software-as-a-service including Hosting</option>
                    <option value="KO">Website design and Services</option>
                    <option value="KP">Computer Teaching Aids and Materials</option>
                    <option value="KQ">Apple Mac Desk Top Computer Purchase, Maintenance, repair, hire</option>
                    <option value="KR">Sun/Unix Equipment Purchasing, maintenance, repair and hire</option>
                    <option value="KS">IT Managed Services</option>
                    <option value="KT">IT Hardware support & maintenance</option>
                    <option value="KU">IT Hire & Rental</option>
                    <option value="KV">Scanning Equipment</option>
                    <option value="KW">IT Software Development</option>
                    <option value="KZ">Other and General Computer</option>
                    <option value="L">Laboratory/Animal House Supplies & Services</option>
                    <option value="LA">Laboratory Support Equipment Accommodation Accessories</option>
                    <option value="LB">Laboratory Animals</option>
                    <option value="LC">Laboratory Small Apparatus and Equipment Purchase and Hire</option>
                    <option value="LD">Other Sciences (Astronomy, Sports Science, etc) Supplies and Services</option>
                    <option value="LE">Laboratory Blood Products Human Organs, Tissue, Body parts and Cadavers</option>
                    <option value="LF">Laboratory Bonded Alcohol</option>
                    <option value="LG">Laboratory Capital Equipment</option>
                    <option value="LH">Laboratory Chemicals</option>
                    <option value="LI">Laboratory Research Services</option>
                    <option value="LJ">Laboratory Clothing</option>
                    <option value="LK">Laboratory Consumables and Sundries incl. Disposables</option>
                    <option value="LL">Laboratory Diagnostic Testing and Calibration Services</option>
                    <option value="LM">Laboratory Equipment Maintenance and Repair</option>
                    <option value="LN">Laboratory Gases and Refrigerants and Associated Rentals</option>
                    <option value="LP">Laboratory Glassware</option>
                    <option value="LQ">Pharmaceuticals - Non-veterinary</option>
                    <option value="LR">Pharmaceuticals, Veterinary</option>
                    <option value="LS">Laboratory Plasticware</option>
                    <option value="LT">Laboratory Controlled Chemicals & Drugs</option>
                    <option value="LU">Laboratory Refrigerants include Liquid Nitrogen</option>
                    <option value="LV">Scintillation Fluids</option>
                    <option value="LW">Stable Isotopes and Radiochemicals</option>
                    <option value="LX">Tissue Culture and Bacteriological Media</option>
                    <option value="LZ">Other and General Laboratory</option>
                    <option value="M">Workshop & Maintenance Supplies (including Engineering)</option>
                    <option value="MA">Batteries</option>
                    <option value="MB">Electrical Sundries and Components</option>
                    <option value="MC">Fasteners inc. Nuts, Bolts, Rivets etc</option>
                    <option value="MD">Hand Tools</option>
                    <option value="ME">Handling and Storage Equipment Purchase Maintenance Repair and Hire</option>
                    <option value="MF">Hand & Power Tools and Accessories</option>
                    <option value="MG">Workshop Equipment and Tool Maintenance and Repair</option>
                    <option value="MH">Mechanical Components and Spare Parts</option>
                    <option value="MJ">Workshop Metals</option>
                    <option value="MK">Raw Materials inc. Lubricants and Road Salt</option>
                    <option value="ML">Workshop Plastics Glass and Ceramics</option>
                    <option value="MM">Workshop Wood</option>
                    <option value="MN">Electronic Components and Test Equipment Purchase Maintenance repair and hire</option>
                    <option value="MP">Workshop Plumbing Sundries</option>
                    <option value="MQ">Workshop, Ironmongery, Door Furniture, Locksmiths Supplies and Services</option>
                    <option value="MR">Adhesives, Fillers and Sealants</option>
                    <option value="MS">Workshop Consumables</option>
                    <option value="MT">Workshop Teaching Aids and Materials</option>
                    <option value="MZ">Other General Workshop and Maintenance Supplies</option>
                    <option value="N">Museums and Art</option>
                    <option value="NA">Art Exhibits and Museum Collections</option>
                    <option value="NB">Hire & Rental of Art Exhibits and Museum Collections</option>
                    <option value="NC">Conservation & Restoration Materials</option>
                    <option value="ND">Conservation & Restoration Services</option>
                    <option value="NE">Commercial and Graphic Art Equipment Purchase and Maintenance and Consumables</option>
                    <option value="NF">Arts Equipment Purchase and Maintenance and Consumables</option>
                    <option value="NG">Fashion & Textile Design - Equipment Purchase and Maintenance & Consumables</option>
                    <option value="NH">Museum Specialist Furniture</option>
                    <option value="P">Printing, Reprographics and Photocopying</option>
                    <option value="PA">Printing, Binding and Finishing Services</option>
                    <option value="PB">External or Outsourced Printing</option>
                    <option value="PC">Printing Consumables, Toners and Inks</option>
                    <option value="PD">Printing - External Design and Artwork</option>
                    <option value="PE">Printing Equipment Purchase, Lease, Hire and Maintenance</option>
                    <option value="PF">External Typesetting, Colour Separation etc</option>
                    <option value="PG">Printing Paper and Specials (NOT PHOTOCOPY PAPER - SEE S)</option>
                    <option value="PH">Printing Card and Board</option>
                    <option value="PJ">Printing Equipment Purchase & Maintenance</option>
                    <option value="PK">Printing - Managed Print Services</option>
                    <option value="PZ">Other and General Printing</option>
                    <option value="Q">Telecommunications</option>
                    <option value="QA">Mail Services</option>
                    <option value="QB">Mail Room Equipment Purchase, Lease & Maintenance</option>
                    <option value="QC">Courier Services</option>
                    <option value="QD">Freight, Carriage & Haulage Services</option>
                    <option value="QE">Mail Services Overseas/International</option>
                    <option value="QF">Spare</option>
                    <option value="QG">Telephony Capital Purchase</option>
                    <option value="QH">Telephony Maintenance</option>
                    <option value="QJ">Telecoms Transmission Equipment Purchase & Maintenance</option>
                    <option value="QL">Radios, Mobile, Encrypted</option>
                    <option value="QM">Phone Cards, Swipe Cards, Equipment & Supplies</option>
                    <option value="QN">Communications Equipment & Accessories</option>
                    <option value="QP">Freight Carriage & Haulage Services (SUSPENDED)</option>
                    <option value="QR">Telephony Land & Mobile Line Rental Call Charges</option>
                    <option value="QS">Telephony - Mobile Line Rental, Call Charges, Equipment</option>
                    <option value="QT">Data Telecommunications Services</option>
                    <option value="QZ">Other Postal & Telecommunications</option>
                    <option value="R">Professional & Bought-in Services including Consultancy</option>
                    <option value="RA">Advertising Services</option>
                    <option value="RB">Conferences & Meetings (Event Management)</option>
                    <option value="RC">Data Information Services</option>
                    <option value="RD">Accountancy Services e.g. Audit Consultancy</option>
                    <option value="RE">Consultancy including IT excluding Estates</option>
                    <option value="RF">Insurance Services</option>
                    <option value="RG">Legal & Tax Services</option>
                    <option value="RH">Banking Services</option>
                    <option value="RI">Financial Investment Services</option>
                    <option value="RJ">Patents IPR Trademarks Royalties Copyright</option>
                    <option value="RK">Temporary & Recruitment Employment Agencies (Staff)</option>
                    <option value="RL">Promotions & Publicity (incl Exhibitions and Fairs)</option>
                    <option value="RM">Speakers & Presenters</option>
                    <option value="RN">Subscriptions (Learned Society Professional etc.)</option>
                    <option value="RO">Graduation Services</option>
                    <option value="RP">Training Courses</option>
                    <option value="RQ">Marketing & Student Recruitment Services</option>
                    <option value="RR">Debt Collection Services</option>
                    <option value="RS">Market Research Services</option>
                    <option value="RT">Auction Services</option>
                    <option value="RU">Translation Interpreter Transcription & Procedural Writing Services</option>
                    <option value="RV">Archival and Storage Services including EDM</option>
                    <option value="RW">Student Placement Programmes Costs and Expenses</option>
                    <option value="RX">Branding and Media Services</option>
                    <option value="RY">Artistes and Conductors</option>
                    <option value="RZ">Other/General Professional & Bought-in Services</option>
                    <option value="S">Stationery & Office Supplies</option>
                    <option value="SA">Envelopes</option>
                    <option value="SB">Files, Filing Folders, Binders</option>
                    <option value="SC">Office Equipment Purchase, Lease, Hire and Maintenance</option>
                    <option value="SD">Diaries, Calendars</option>
                    <option value="SE">Spare</option>
                    <option value="SF">Papers</option>
                    <option value="SG">Photocopying - Rental, Lease, Purchase, Maintenance, Charges</option>
                    <option value="SH">Pre-printed Stationery</option>
                    <option value="SJ">General Stationery</option>
                    <option value="SK">Desktop Sundries (SUSPENDED)</option>
                    <option value="SL">Education Packs and Materials Specific to Teaching and Learning</option>
                    <option value="SZ">Other and General Stationery and Office Supplies</option>
                    <option value="T">Travel & Transport (incl. Vehicle Hire & Subsistence)</option>
                    <option value="TA">Accommodation & Hotels (Direct)</option>
                    <option value="TO">Storage & Warehouse Services</option>
                    <option value="TP">Student Travel Arrangements</option>
                    <option value="TQ">Conferences, Meetings, and Room Bookings</option>
                    <option value="TR">Re-location and Household Removal Expenses</option>
                    <option value="TS">Spare</option>
                    <option value="TT">Package Travel, Field Trips</option>
                    <option value="TU">Travel & Subsistence (Non Employees)</option>
                    <option value="TZ">Other/General Travel & Transport</option>
                    <option value="U">Health & Safety & Security</option>
                    <option value="UB">Fire Protection/Fire Fighting Equipment & Services</option>
                    <option value="UC">First Aid Supplies</option>
                    <option value="UD">Safety & Personal Protection Equipment</option>
                    <option value="UE">Security Equipment & Consumables</option>
                    <option value="UF">Security Services</option>
                    <option value="UH">Occupational Health Supplies & Services</option>
                    <option value="UJ">Surveillance Equipment, Installation & Maintenance (CCTV, Intercom)</option>
                    <option value="UK">Access Control, Keys, Security Passes</option>
                    <option value="UL">Counselling Services</option>
                    <option value="UM">Alarms (including Fire, Smoke, Gas, Intruder) purchase, maintenance, repair and hire</option>
                    <option value="UN">Special Needs/DDA Suppliers, Services Equipment purchase, maintenance, repair and hire</option>
                    <option value="UP">Allied Health Professions</option>
                    <option value="UZ">Other/General Safety & Security</option>
                    <option value="V">Vehicles, Fleet Management (Purchase, Lease, Contract Hire)</option>
                    <option value="VA">Vehicle Purchase</option>
                    <option value="VB">Motoring Association Charges (excl Road Tax)</option>
                    <option value="VC">Vehicle Lease / Hire / Rental Long Term</option>
                    <option value="VD">Vehicle Tax</option>
                    <option value="VE">Vehicle Maintenance & MOT</option>
                    <option value="VF">Tyres</option>
                    <option value="VG">Fuels</option>
                    <option value="VH">Vehicle Parts & Accessories</option>
                    <option value="VJ">Garage Equipment</option>
                    <option value="VK">Specialist Vehicle Purchase - Motor Cycle & Bicycles</option>
                    <option value="VL">Specialist Vehicle Purchase - Marine Craft</option>
                    <option value="VM">Specialist Vehicle Purchase - Aircraft & Helicopters</option>
                    <option value="VP">Vehicle Storage</option>
                    <option value="VR">Vehicle Accessories</option>
                    <option value="VZ">Other/General Vehicle Purchase & Lease Hire</option>
                    <option value="W">Estates & Buildings</option>
                    <option value="WA">Building, Repair and Maintenance Materials</option>
                    <option value="WB">Capital Projects</option>
                    <option value="WC">Decoration Materials, Works & Services</option>
                    <option value="WD">Conservation Projects</option>
                    <option value="WE">Electricity Supply & Services (SUSPENDED)</option>
                    <option value="WF">Fencing - Property & Specialist</option>
                    <option value="WG">Gas Supply & Services (SUSPENDED)</option>
                    <option value="WH">Building Repairs & Maintenance Service</option>
                    <option value="WI">Specialist Building Services (Scaffolding, Plumbing, Carpentry, Roofing)</option>
                    <option value="WJ">Grounds Maintenance Equipment</option>
                    <option value="WK">Ground Maintenance, Supplies & Services</option>
                    <option value="WL">Testing & Calibration Services (Non Scientific)</option>
                    <option value="WM">TBC</option>
                    <option value="WN">Plant Purchase, Hire & Maintenance</option>
                    <option value="WP">Temporary & Mobile Buildings, Hire & Purchase</option>
                    <option value="WR">Solid Fuel</option>
                    <option value="WT">Cleaning Services</option>
                    <option value="WU">Building Related Professional Services</option>
                    <option value="WV">Pest & Vermin Control Services</option>
                    <option value="WW">Estates Tool & Plant Hire</option>
                    <option value="WX">Signs & Signposting</option>
                    <option value="WY">Tent & Marquee Purchase, Hire & Maintenance</option>
                    <option value="WZ">Other/General Estates & Buildings</option>
                    <option value="X">Non Influenceable Spend</option>
                    <option value="XA">Fees, Lecturing, Examining, Moderating</option>
                    <option value="XB">Credit Card Charges</option>
                    <option value="XC">Customs & Excise - VAT</option>
                    <option value="XD">Fees - Students</option>
                    <option value="XE">Hospitality/Entertainment/Courtesy Expenses (Non employees)</option>
                    <option value="XF">Works of Art</option>
                    <option value="XG">Building/Premises/Land - Rent, Lease, Hire, Feu Duties</option>
                    <option value="XH">Welfare</option>
                    <option value="XJ">Other Educational Establishments</option>
                    <option value="XK">Other Public Bodies</option>
                    <option value="XL">Rates</option>
                    <option value="XM">Awards, Gifts, Trophies, Souvenirs</option>
                    <option value="XN">Bursaries, Scholarships, Endowments, Donations</option>
                    <option value="XP">Purchase Card Purchases</option>
                    <option value="XQ">Identity Access Cards (SUSPENDED)</option>
                    <option value="XR">Interdepartmental Trading</option>
                    <option value="XS">Student Related Charges Excluding Fees</option>
                    <option value="XT">Professional Associations</option>
                    <option value="XU">Salary Sacrifice Schemes</option>
                    <option value="XY">Other/General Unclassified</option>
                    <option value="XZ">Other/General Miscellaneous</option>
                    <option value="Y">Facilities Operations</option>
                    <option value="YA">Mail Services Including Fulfilment</option>
                    <option value="YB">Mail Room Equipment Purchase Lease & Maintenance</option>
                    <option value="YC">Courier Services</option>
                    <option value="YD">Freight Carriage & Haulage Services</option>
                    <option value="YE">Furniture - Office Removal and Storage</option>
                    <option value="YF">Warehouse and Storage</option>
                    <option value="YG">Agric/Hortic Disposal Services</option>
                    <option value="YM">Clothing and Tailoring Supplies and Services</option>
                    <option value="YN">Watercooler Equipment Services and Consumables</option>
                    <option value="YP">Cleaning Services Including Window Cleaning</option>
                    <option value="YQ">Pest & Vermin Control Services</option>
                    <option value="YR">Catering Services Outsourced at a Fixed Site</option>
                    <option value="YS">Specialist Removals and Storage</option>
                    <option value="YY">Not Relevant to Purchasing, Procurement</option>
                </select>

                <form className="needs-validation" noValidate>
                    <div className="row g-2">

                        <div className={visible}>
                            <label htmlFor="firstName" className="form-label"><strong>{category}</strong></label>
                            <input type="number" className="form-control" name={category} placeholder="Enter waste in tonne" value={procurementReport[category] ?? ''} onChange={handleProcurementChange} required />
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

    function Results() {

        const navigate = useNavigate();

        const handleBack = () => {
            navigate("/calculator/procurement")
        };

        const handleSubmit = () => {
            navigate("/dashboard")
        };

        return (
            <main class="ms-sm-auto px-md-4">
                <h2>Results</h2>
                
                <div class="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
                    <button type="button" class="btn btn-outline-secondary me-2" onClick={handleBack}>Back</button>
                    <button type="button" class="btn btn-success" onClick={handleSubmit}>Submit</button>
                </div>
            </main>
        );
    };


    return (    
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 20%", backgroundColor: "#385A4F" }} />
            <main style={{ flex: "1", padding: "1rem", maxWidth: "80%" }}>
                <CalculationBar />
                {JSON.stringify(report, null, 2)}
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
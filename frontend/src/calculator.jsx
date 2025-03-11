import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Select from "react-select";
import CalculationBar from "./CalculationBar";
import ResultsDisplay from "./ResultsDisplay";
import Sidebar from "./Sidebar";
import "./static/dashboard.css";
import "./static/Instruction.css";
import procurementCategories from "./static/procurementCategories.json";
import "./static/Sidebar.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Calculator() {
  const [report, setReport] = useState({});

  const navigate = useNavigate();

  async function submitReport() {
    try {
      const response = await fetch(`${backendUrl}api2/submit/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Report saved:", responseData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error fetching calculations:", error);
    }
  }

  function Instructions() {
    const navigate = useNavigate();
    const steps = [
      {
        title: "Step 1 - General Data Entry",
        content: (
          <ul className="text-sm text-[#4F7A6A] list-none pl-5 space-y-2 pb-4">
            <li>
              <strong>Utilities:</strong> Enter FTE staff numbers and GIA data.
            </li>
            <li>
              <strong>Travel:</strong> Input travel distances by transport type.
            </li>
            <li>
              <strong>Waste:</strong> Estimate project waste.{" "}
              <em>
                Tip: Multiply weekly waste by 52 to get the annual figure.
              </em>
            </li>
          </ul>
        ),
      },
      {
        title: "Step 2 - Procurement",
        content: (
          <p className="text-sm text-[#4F7A6A] pb-4">
            Please enter project-related procurement expenses. Add a new line
            for each category. For reference, this section is taken directly
            from the Higher Education Supply Chain Emission Tool (HESCET)
            created by the Higher Education Procurement Association (HEPA).{" "}
            <a
              href="https://www.hepa.ac.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#385A4F] underline"
            >
              Visit HEPA Website
            </a>
          </p>
        ),
      },
      {
        title: "Step 3 - Results",
        content: (
          <p className="text-sm text-[#4F7A6A] pb-4">
            View a comprehensive summary and visual representations of your
            project&rsquo;s annual carbon footprint. This section includes
            detailed charts and graphs, allowing you to easily interpret your
            data. Use the results to identify key emission sources and explore
            opportunities for reducing your carbon footprint.
          </p>
        ),
      },
      {
        title: "Help & Tips",
        content: (
          <ul className="text-sm text-[#4F7A6A] list-disc pl-5 space-y-2 pb-4">
            <li>
              <strong>&lsquo;Next&rsquo; Button:</strong> Click to save progress
              on each page.
            </li>
            <li>
              <strong>Final Submission:</strong> Review all data before
              submitting.
            </li>
            <li>
              Need help?{" "}
              <a
                href="mailto:sustainable-solutions@glasgow.ac.uk"
                className="text-[#385A4F] underline"
              >
                Contact us
              </a>
            </li>
          </ul>
        ),
      },
    ];

    return (
      <main className="instructions-container">
        <div className="instructions-header">
          <img
            src="/images/UniLogo.png"
            alt="University of Glasgow Logo"
            className="instructions-logo"
          />
          <h2 className="instructions-title">Carbon Footprint Calculator</h2>
        </div>

        {/* Introduction Text */}
        <p className="instructions-intro">
          Welcome to the Academic Carbon Footprint Calculator. This tool is
          designed to help you estimate and better understand the annual carbon
          footprint of your research activities. By following the steps below,
          you will be guided through the process of data entry, procurement
          details, and the interpretation of results to support informed
          sustainability decisions.
        </p>

        {/* Cards Grid */}
        <div className="flex flex-col gap-10 mb-12 px-4">
          {steps.map(({ title, content }, index) => (
            <div key={index} className="instructions-card">
              <div className="instructions-card-header">
                <h3 className="instructions-card-title">{title}</h3>
              </div>
              <div className="instructions-card-content">{content}</div>
            </div>
          ))}
        </div>

        <div className="instructions-footer">
          <button
            type="button"
            className="btn btn-moss"
            onClick={() => navigate("/calculator/utilities")}
          >
            Start
          </button>
        </div>
      </main>
    );
  }

  function Utilities() {
    const navigate = useNavigate();
    const [utilitiesReport, setUtilitiesReport] = useState({});
    useEffect(() => {
      if (typeof report["utilities"] !== "undefined") {
        setUtilitiesReport(report["utilities"]);
      }
    }, []);

    function handleRoute() {
      setReport((prevReport) => ({
        ...prevReport,
        ["utilities"]: utilitiesReport,
      }));
      navigate("/calculator/travel");
    }

    function handleChange(event) {
      const { name, value } = event.target;
      setUtilitiesReport((prevReport) => ({ ...prevReport, [name]: value }));
    }

    return (
      <main className="ms-sm-auto px-md-4">
        {/* {JSON.stringify(utilitiesReport, null, 2)} */}
        <form className="needs-validation" noValidate>
          <div className="row g-2">
            <div className="mt-4 fst-italic">
              <strong>Personnel:</strong>
            </div>
            <hr />

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Number of FTE staff working on project</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="FTE-staff"
                  placeholder="Enter number of people"
                  value={utilitiesReport["FTE-staff"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-5">
                <label htmlFor="firstName" className="form-label">
                  <strong>Total number of FTE research group members</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="FTE-members"
                  placeholder="Enter number of people"
                  value={utilitiesReport["FTE-members"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="mt-4 fst-italic">
              <strong>
                Type of space (for calculation of electricity and gas
                consumption):
              </strong>
            </div>
            <hr />

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Academic laboratory</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="Academic Laboratory"
                  placeholder="Enter area in m²."
                  value={utilitiesReport["Academic Laboratory"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Admin office</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="Admin Office"
                  placeholder="Enter area in m²."
                  value={utilitiesReport["Admin Office"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Academic office</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="Academic Office"
                  placeholder="Enter area in m²."
                  value={utilitiesReport["Academic Office"]}
                  onChange={handleChange}
                  required
                />
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
            <hr />

            <div className="row mb-2">
              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Physical sciences laboratory</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="Physical Sciences Laboratory"
                  placeholder="Enter area in m²."
                  value={utilitiesReport["Physical Sciences Laboratory"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Engineering laboratory</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="Engineering Laboratory"
                  placeholder="Enter area in m²."
                  value={utilitiesReport["Engineering Laboratory"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Medical/Life sciences laboratory</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="Medical/Life Sciences Laboratory"
                  placeholder="Enter area in m²."
                  value={utilitiesReport["Medical/Life Sciences Laboratory"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Office/Admin space</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="Office/Admin Space"
                  placeholder="Enter area in m²."
                  value={utilitiesReport["Office/Admin Space"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
          <button type="button" className="btn btn-moss" onClick={handleRoute}>
            Next
          </button>
        </div>
      </main>
    );
  }

  function Travel() {
    const navigate = useNavigate();
    const [travelReport, setTravelReport] = useState({});
    useEffect(() => {
      if (typeof report["travel"] !== "undefined") {
        setTravelReport(report["travel"]);
      }
    }, []);

    function handleBack() {
      navigate("/calculator/utilities");
    }

    function handleRoute() {
      setReport((prevReport) => ({ ...prevReport, ["travel"]: travelReport }));
      navigate("/calculator/waste");
    }

    function handleChange(event) {
      const { name, value } = event.target;
      setTravelReport((prevReport) => ({ ...prevReport, [name]: value }));
    }

    return (
      <main className="ms-sm-auto px-md-4">
        {/* {JSON.stringify(travelReport, null, 2)} */}
        <form className="needs-validation" noValidate>
          <div className="row g-2">
            <div className="mt-4 fst-italic">
              <strong>Air travel</strong>
            </div>
            <hr />

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Economy short-haul, to/from UK</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="air-eco-short"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["air-eco-short"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Business short-haul, to/from UK</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="air-business-short"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["air-business-short"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Economy long-haul, to/from UK</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="air-eco-long"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["air-eco-long"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Business long-haul, to/from UK</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="air-business-long"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["air-business-long"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Economy international, to/from non-UK</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="air-eco-inter"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["air-eco-inter"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Business international, to/from non-UK</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="air-business-inter"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["air-business-inter"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="mt-4 fst-italic">
              <strong>Sea travel</strong>
            </div>
            <hr />

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Ferry</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="sea-ferry"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["sea-ferry"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="mt-4 fst-italic">
              <strong>Land travel</strong>
            </div>
            <hr />

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Car</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-car"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-car"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Motorbike</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-motor"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-motor"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Taxis</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-taxis"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-taxis"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Local Bus</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-bus"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-bus"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Coach</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-coach"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-coach"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>National rail</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-national-rail"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-national-rail"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>International rail</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-inter-rail"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-inter-rail"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-4">
                <label htmlFor="firstName" className="form-label">
                  <strong>Light rail and tram</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="land-light-rail"
                  placeholder="Enter number of distance(km)"
                  value={travelReport["land-light-rail"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={handleBack}
          >
            Back
          </button>
          <button type="button" className="btn btn-moss" onClick={handleRoute}>
            Next
          </button>
        </div>
      </main>
    );
  }

  function Waste() {
    const navigate = useNavigate();
    const [wasteReport, setWasteReport] = useState({});
    useEffect(() => {
      if (typeof report["waste"] !== "undefined") {
        setWasteReport(report["waste"]);
      }
    }, []);

    function handleBack() {
      navigate("/calculator/travel");
    }

    function handleRoute() {
      setReport((prevReport) => ({ ...prevReport, ["waste"]: wasteReport }));
      navigate("/calculator/procurement");
    }

    function handleChange(event) {
      const { name, value } = event.target;
      setWasteReport((prevReport) => ({ ...prevReport, [name]: value }));
    }

    return (
      <main className="ms-sm-auto px-md-4">
        {/* {JSON.stringify(wasteReport, null, 2)} */}
        <form className="needs-validation" noValidate>
          <div className="row g-2">
            <div className="mt-4 fst-italic">
              <strong>Recycling</strong>
            </div>
            <hr />

            <div className="row mb-2">
              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Mixed recycling</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="mixed-recycle"
                  placeholder="Enter waste in tonne"
                  value={wasteReport["mixed-recycle"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>WEEE mixed recycling</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="WEEEmixed-recycle"
                  placeholder="Enter waste in tonne"
                  value={wasteReport["WEEEmixed-recycle"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>

            <div className="mt-4 fst-italic">
              <strong>Waste</strong>
            </div>
            <hr />

            <div className="row mb-2">
              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>General waste</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="general-waste"
                  placeholder="Enter waste in tonne"
                  value={wasteReport["general-waste"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Clinical waste</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="clinical-waste"
                  placeholder="Enter waste in tonne"
                  value={wasteReport["clinical-waste"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Chemical waste</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="chemical-waste"
                  placeholder="Enter waste in tonne"
                  value={wasteReport["chemical-waste"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>

              <div className="col-sm-3">
                <label htmlFor="firstName" className="form-label">
                  <strong>Biological waste</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="bio-waste"
                  placeholder="Enter waste in tonne"
                  value={wasteReport["bio-waste"]}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">
                  Valid number is required.
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={handleBack}
          >
            Back
          </button>
          <button type="button" className="btn btn-moss" onClick={handleRoute}>
            Next
          </button>
        </div>
      </main>
    );
  }

  function Procurement() {
    const navigate = useNavigate();
    const [procurementReport, setProcurementReport] = useState({});
    const [currentRow, setCurrentRow] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [rowCategory, setRowCategory] = useState({});
    const [categorySelected, setCategorySelected] = useState({});
    const [searchText, setSearchText] = useState(""); // Tracks search input

    useEffect(() => {
      /* 
            this useEffect is responsible for reloading saved procurement data:
            if it exists and hasn't been loaded yet, the procurementReport is updated,
            then rowCategory and categorySelected are populated with that data,
            after which currentRow is updated and loaded is set to true to avoid repeated loading
            */
      if (typeof report["procurement"] !== "undefined" && !loaded) {
        setProcurementReport(report["procurement"]);
        let count = 0;
        let newRowCategory = {};
        let newCategorySelected = {};
        for (const entry in report["procurement"]) {
          count++;
          newRowCategory[count] = entry;
          newCategorySelected[entry] = true;
        }
        setCurrentRow(count);
        setRowCategory(newRowCategory);
        setCategorySelected(newCategorySelected);
        setLoaded(true);
      }
    }, [loaded]);

    function handleAddRow() {
      //new row is added using a new row index
      let row = currentRow + 1;
      setCurrentRow(row);
      setRowCategory((prevRowCategory) => ({
        ...prevRowCategory,
        [row]: null,
      }));
    }

    function handleCategoryChange(selectedOption, { name }) {
      if (!selectedOption) return;
      
      const rowNum = name;

      //remove previously seleted category
      const prevCategory = rowCategory[rowNum];
      if (prevCategory) {
        setCategorySelected((prev) => ({ ...prev, [prevCategory]: false }));
      }

      setRowCategory((prevRowCategory) => ({
        ...prevRowCategory,
        [rowNum]: selectedOption.value,
      }));

      setCategorySelected((prevCategorySelected) => ({
        ...prevCategorySelected,
        [selectedOption.value]: true,
      }));

      setTimeout(() => {
        const amountInput = document.getElementById(`amount-${rowNum}`);
        if (amountInput) {
          amountInput.focus();
        }
      }, 100);
    }

    function handleBack() {
      navigate("/calculator/waste");
    }

    function handleRoute() {
      setReport((prevReport) => ({
        ...prevReport,
        ["procurement"]: procurementReport,
      }));
      navigate("/calculator/results");
    }

    function handleProcurementDelete(num) {
      //first the data is cleared from the report, then category is removed from the list of selected categories, finally the row is deleted
      setProcurementReport((prevReport) => {
        const updatedReport = { ...prevReport };
        delete updatedReport[rowCategory[num]];
        return updatedReport;
      });

      setCategorySelected((prevCategorySelected) => ({
        ...prevCategorySelected,
        [rowCategory[num]]: false,
      }));

      setRowCategory((prevRowCategory) => {
        const updatedRowCategory = { ...prevRowCategory };
        delete updatedRowCategory[num];
        return updatedRowCategory;
      });
    }

    function handleProcurementChange(event) {
      const { name, value } = event.target;
      setProcurementReport((prevReport) => ({ ...prevReport, [name]: value }));
    }

    return (
      <main className="d-flex flex-column min-vh-100 ms-sm-auto px-md-4">
        {/* Header and New Row Button */}
        <div className="d-flex justify-content-between align-items-center">
          <h2>Procurement</h2>
          <button
            className="btn btn-outline-moss px-5 py-1"
            style={{ fontSize: "2rem" }}
            onClick={handleAddRow}
          >
            +
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive small mt-3">
          <table className="table table-light table-sm">
            <thead>
              <tr className="align-middle text-center">
                <th scope="col">category</th>
                <th scope="col">value</th>
                <th scope="col"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {Object.keys(rowCategory).map((num) => (
                <tr key={num} id={num} className="align-middle text-center">
                  <td>
                    {/* Search Input for Filtering Dropdown Options */}
                    <input
                      type="text"
                      placeholder="Search category..."
                      className="form-control form-control-sm mb-1"
                      onChange={(event) =>
                        setSearchText(event.target.value.toLowerCase())
                      }
                    />

                <Select
                    options={procurementCategories.map((category) => ({
                      value: category.code,
                      label: `${category.code} - ${category.name}`,
                      isDisabled: categorySelected[category.code], // Disable already selected categories
                    })) || []}
                    value={
                      rowCategory[num]
                        ? {
                            value: rowCategory[num],
                            label:
                              procurementCategories.find(
                                (c) => c.code === rowCategory[num]
                              )?.name || rowCategory[num],
                          }
                        : null
                    }
                    onChange={handleCategoryChange}
                    name={num} // Pass row number to track category selection
                    placeholder="Select or search a category..."
                    isSearchable // enables typing inside the dropdown to search
                    menuPortalTarget={document.body}
                    styles = {{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({
                        ...base,
                        maxHeight:"600px",
                        overflowY: "auto",
                      })
                    }}
                  />
                </td>

                  <td className="text-center">
                    <div className="d-inline-flex align-items-center">
                      <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                        £:
                      </span>
                      <input
                        type="number"
                        className="form-control form-control-sm ms-2"
                        disabled={rowCategory[num] === null}
                        id={'amount-${num}'}
                        name={rowCategory[num]}
                        placeholder="Expenses, GBP"
                        value={procurementReport[rowCategory[num]] ?? ""}
                        onChange={handleProcurementChange}
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger w-30"
                      type="button"
                      onClick={() => handleProcurementDelete(num)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nav Buttons */}
        <div className="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={handleBack}
          >
            Back
          </button>
          <button type="button" className="btn btn-moss" onClick={handleRoute}>
            Next
          </button>
        </div>
      </main>
    );
  }

  function Results() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
      if (report) {
        peekCalculations(report);
      }
    }, []);

    async function peekCalculations(report) {
      try {
        const response = await fetch(`${backendUrl}api2/report/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
          body: JSON.stringify(report),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Calculations received:", responseData);

        setData(responseData);
      } catch (error) {
        console.error("Error fetching calculations:", error);
      }
    }

    function handleBack() {
      navigate("/calculator/procurement");
    }

    return (
      <main className="ms-sm-auto px-md-4">
        <h2>Results</h2>
        <ResultsDisplay calculations={data} rawData={report} />
        <div className="d-flex justify-content-end position-fixed bottom-0 end-0 p-3">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={handleBack}
          >
            Back
          </button>
          <button type="button" className="btn btn-moss" onClick={submitReport}>
            Submit
          </button>
        </div>
      </main>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar style={{ flex: "0 0 17%" }} />
      <main style={{ flex: "1", padding: "1rem", overflowY: "auto" }}>
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
  );
}

export { Calculator };

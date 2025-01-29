import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./static/CalculationBar.css";

const CalculationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const showBar = location.pathname !== "/calculator";

    const steps = [
        { label: "Step 1: General Data Entry", path: "/calculator/general-data-entry" },
        { label: "Step 2: Procurement", path: "/calculator/procurement" },
        { label: "Step 3: Results", path: "/calculator/results" },
    ];

    const subSteps = [
        { label: "Utilities", path: "/calculator/utilities" },
        { label: "Travel", path: "/calculator/travel" },
        { label: "Waste", path: "/calculator/waste" },
    ];

    const isStep1 =
        location.pathname.startsWith("/calculator/general-data-entry") ||
        location.pathname.startsWith("/calculator/utilities") ||
        location.pathname.startsWith("/calculator/travel") ||
        location.pathname.startsWith("/calculator/waste");

    const handleNavigate = (path) => {
        if (path === "/calculator/general-data-entry") {
            navigate("/calculator/utilities");
        } else {
            navigate(path);
        }
    };

    if (!showBar) {
        return null;
    }

    return (
        <div>
            <div className="nav-container">
                {steps.map((step) => (
                    <div
                        key={step.path}
                        className={`nav-item ${location.pathname.startsWith(step.path) ? "active" : ""
                            }`}
                        onClick={() => handleNavigate(step.path)}
                    >
                        {step.label}
                    </div>
                ))}
            </div>

            {isStep1 && (
                <div className="sub-nav-container">
                    {subSteps.map((subStep) => (
                        <div
                            key={subStep.path}
                            className={`sub-nav-item ${location.pathname === subStep.path ? "active" : ""
                                }`}
                            onClick={() => navigate(subStep.path)}
                        >
                            {subStep.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalculationBar;

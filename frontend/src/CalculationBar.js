import React, { useState } from "react";
import "./static/CalculationBar.css";

const CalculationBar = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [currentSubStep, setCurrentSubStep] = useState("Utilities");
  
    const steps = [
      { id: 1, label: "Step 1: General Data Entry" },
      { id: 2, label: "Step 2: Procurement" },
      { id: 3, label: "Step 3: Results" },
    ];
  
    const subSteps = ["Utilities", "Travel", "Waste"];
  
    return (
      <div>
        
        <div className="nav-container">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`nav-item ${currentStep === step.id ? "active" : ""}`}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.label}
            </div>
          ))}
        </div>
  
        {currentStep === 1 && (
          <div className="sub-nav-container">
            {subSteps.map((subStep, index) => (
              <div
                key={index}
                className={`sub-nav-item ${currentSubStep === subStep ? "active" : ""}`}
                onClick={() => setCurrentSubStep(subStep)}
              >
                {subStep}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default CalculationBar;

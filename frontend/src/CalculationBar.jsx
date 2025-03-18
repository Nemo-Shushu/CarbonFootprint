import { useLocation } from "react-router-dom";
import "./static/CalculationBar.css";

function CalculationBar() {
  const location = useLocation();

  const showBar = location.pathname !== "/calculator";

  const subSteps = [
    { label: "Utilities", path: "/calculator/utilities" },
    { label: "Travel", path: "/calculator/travel" },
    { label: "Waste", path: "/calculator/waste" },
  ];

  //so only applicable step titles are shown
  const isStep1 =
    location.pathname.startsWith("/calculator/general-data-entry") ||
    location.pathname.startsWith("/calculator/utilities") ||
    location.pathname.startsWith("/calculator/travel") ||
    location.pathname.startsWith("/calculator/waste");

  function getCurrentStepTitle() {
    if (location.pathname === "/calculator/utilities") {
      return "Step 1: General Data Entry - Utilities";
    }
    if (location.pathname === "/calculator/travel") {
      return "Step 1: General Data Entry - Travel";
    }
    if (location.pathname === "/calculator/waste") {
      return "Step 1: General Data Entry - Waste";
    }
    if (location.pathname === "/calculator/procurement") {
      return "Step 2: Procurement";
    }
    if (location.pathname === "/calculator/results") {
      return "Step 3: Results";
    }
    return "Step 1: General Data Entry";
  }

  if (!showBar) {
    return null;
  }

  return (
    <div>
      {/* change static mapping to dynamic*/}
      <div className="nav-container">
        <h2 className="step-title">{getCurrentStepTitle()}</h2>{" "}
        {/* Shows correct step title */}
      </div>

      {isStep1 && (
        <div className="sub-nav-container">
          {subSteps.map((subStep) => (
            <div
              key={subStep.path}
              className={`sub-nav-item ${
                location.pathname === subStep.path ? "active" : ""
              }`}
              // onClick={() => navigate(subStep.path)}
            >
              {subStep.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalculationBar;

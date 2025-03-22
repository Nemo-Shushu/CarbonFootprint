import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../useAuth";
import Sidebar from "../../../Sidebar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../assets/ManageFactors.css";
import FactorTable from "./FactorTable";
import ProcurementTable from "./ProcurementTable";
import BenchmarkTable from "./BenchmarkTable";
import { getIntensityFactors, getProcurementFactors } from "../api/apiFactors";

function ManageFactors() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("intensity");

  function handleProtect() {
    navigate("/sign-in");
  }

  // Handle tab change
  const handleTabSelect = (key) => {
    setActiveKey(key);
  };

  // Function to get tab title style based on active state
  const getTabTitleStyle = (tabKey) => {
    return {
      fontWeight: "bold",
      fontSize: "1.5rem",
      color: activeKey === tabKey ? "black" : "grey",
      transition: "color 0.3s ease",
    };
  };

  return useAuth() ? (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar style={{ flex: "0 0 17%" }} />
      <main
        style={{ flex: "1", padding: "1rem", overflowY: "auto" }}
        className="update-factors-container"
      >
        <Tabs
          activeKey={activeKey}
          onSelect={handleTabSelect}
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab
            eventKey="intensity"
            title={<span style={getTabTitleStyle("intensity")}>General</span>}
            className="container-fluid"
          >
            <FactorTable
              tableName={"General Intensity"}
              conversionFactors={getIntensityFactors}
            />
          </Tab>
          <Tab
            eventKey="procurement"
            title={
              <span style={getTabTitleStyle("procurement")}>Procurement</span>
            }
            className="container-fluid"
          >
            <ProcurementTable
              tableName={"Procurement Intensity"}
              conversionFactors={getProcurementFactors}
            />
          </Tab>
          <Tab
            eventKey="benchmark"
            title={<span style={getTabTitleStyle("benchmark")}>Benchmark</span>}
            className="container-fluid"
          >
            <BenchmarkTable />
          </Tab>
        </Tabs>
      </main>
    </div>
  ) : (
    handleProtect()
  );
}

export default ManageFactors;

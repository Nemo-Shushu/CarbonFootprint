import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../useAuth";
import Sidebar from "../../../Sidebar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../assets/ManageFactors.css";
import FactorTable from "./FactorTable";
import { getConversionFactors } from "../api/apiFactors";

function ManageFactors() {
  const navigate = useNavigate();

  function handleProtect() {
    navigate("/sign-in");
  }

  return useAuth() ? (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar style={{ flex: "0 0 17%" }} />
      <main
        style={{ flex: "1", padding: "1rem", overflowY: "auto" }}
        className="update-factors-container"
      >
        <Tabs
          defaultActiveKey="intensity"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab
            eventKey="intensity"
            title="Intensity Factors"
            className="container-fluid"
          >
            <FactorTable
              tableName={"Intensity"}
              conversionFactors={getConversionFactors}
            />
          </Tab>
          <Tab
            eventKey="procurement"
            title="Procurement Factors"
            className="container-fluid"
          >
            <FactorTable
              tableName={"Procurement"}
              conversionFactors={getConversionFactors}
            />
          </Tab>
        </Tabs>
      </main>
    </div>
  ) : (
    handleProtect()
  );
}

export default ManageFactors;

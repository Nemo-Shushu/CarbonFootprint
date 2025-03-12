import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../useAuth";
import Sidebar from "../../../Sidebar";
import "../assets/ManageFactors.css";
import FactorTable from "./FactorTable";
import {
  getConversionFactors,
} from "../api/apiFactors";

function ManageFactors() {
  const navigate = useNavigate();

  useEffect(() => {
    getConversionFactors(setConversionFactors);
  }, []);

  const [conversionFactors, setConversionFactors] = useState([]);

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

        <FactorTable
          tableName={"Intensity"}
          conversionFactors={conversionFactors}
        />
      </main>
    </div>
  ) : (
    handleProtect()
  );
}

export default ManageFactors;

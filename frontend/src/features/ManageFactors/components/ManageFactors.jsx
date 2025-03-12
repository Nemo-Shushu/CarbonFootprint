import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../useAuth";
import Sidebar from "../../../Sidebar";
import "../assets/ManageFactors.css";
import { Tooltip } from "react-tooltip";
import Button from "react-bootstrap/Button";
import EditFactor from "./EditFactorModal";
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
  const [showUpdate, setShowUpdate] = useState(false);

  // set title for the edit modals
  const [modalTitle, setModalTitle] = useState("");

  // used to populate and unpopulate modal popups
  const initialFactorValue = [{ id: 0, activity: "", value: 0 }];
  const [selectedFactor, setSelectedFactor] = useState(initialFactorValue);

  function handleProtect() {
    navigate("/sign-in");
  }

  function handleCloseUpdate() {
    setSelectedFactor(initialFactorValue);
    setShowUpdate(false);
  }

  function handleShowUpdate(id, activity, value) {
    setModalTitle("Update");
    setSelectedFactor({ id, activity, value });
    setShowUpdate(true);
  }

  function handleUpdateSubmission(event) {
    handleUpdateSubmissionAPI(event, selectedFactor);
    setConversionFactors((prevState) =>
      prevState.map((item) =>
        item.id === selectedFactor.id ? selectedFactor : item,
      ),
    );
    setShowUpdate(false);
  }

  return useAuth() ? (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar style={{ flex: "0 0 17%" }} />
      <main
        style={{ flex: "1", padding: "1rem", overflowY: "auto" }}
        className="update-factors-container"
      >

        <FactorTable
          tableName={"Manage Conversion Factors"}
          conversionFactors={conversionFactors}
          handleShowEdit={handleShowUpdate}
        />

        <EditFactor
          handleClose={handleCloseUpdate}
          show={showUpdate}
          modalTitle={modalTitle}
          selectedFactor={selectedFactor}
          handleSubmit={handleUpdateSubmission}
          setSelectedFactor={setSelectedFactor}
          buttonContents={"Save Changes"}
        />

        <Tooltip anchorSelect=".edit-icon" place="bottom">
          edit activity
        </Tooltip>
      </main>
    </div>
  ) : (
    handleProtect()
  );
}

export default ManageFactors;

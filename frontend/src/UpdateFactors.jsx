import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Sidebar from "./Sidebar";
import "./static/UpdateFactors.css";
import { Tooltip } from 'react-tooltip';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function UpdateFactors() {
    const navigate = useNavigate();

    function handleProtect() {
        navigate("/sign-in")
    };

    const [conversionFactors, setConversionFactors] = useState([]);


    function getConversionFactors() {
        fetch(backendUrl.concat('api/accounts/conversion-factors/'), {
            method: "GET",
            credentials: "include",
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('failed to retrieve conversion factors');
            }
            return response.json();
          })
          .then(data => {
            setConversionFactors(data);
            console.log(data);
          })
          .catch(err => {
            console.error('failed to retrieve conversion factors', err);
          });
    }

    useEffect(() => {
        getConversionFactors();
    }, []);


    return useAuth() ? (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar style={{ flex: "0 0 17%", }} />
            <main style={{flex: "1", padding: "1rem", overflowY: "auto",}} className="update-factors-container">
                <h1>Manage Conversion Factors</h1>
                <h2></h2>
                <table className="table table-hover">
                    <thead>
                        <tr className="align-middle text-start">
                        <th scope="col" style={{width:"50%"}}>Activity</th>
                        <th scope="col" style={{width:"30%"}}>kg CO2e</th>
                        <th scope="col" style={{width:"20%"}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                    {conversionFactors.map((factor) => (
                        <tr className="align-middle text-start">
                        <td>{factor.activity}</td>
                        <td>{factor.value}</td>
                        <td>
                            <a className="edit-icon me-5"><i className="bi bi-pen-fill"></i></a>
                            <a className="delete-icon me-5 text-danger"><i class="bi bi-trash3-fill"></i></a>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
            
                <Tooltip anchorSelect=".edit-icon" place="bottom">
                    edit activity
                </Tooltip>
                <Tooltip anchorSelect=".delete-icon" place="bottom">
                    delete activity
                </Tooltip>
            </main>
        </div>
    ) : (
        handleProtect()
    );
}

export default UpdateFactors;

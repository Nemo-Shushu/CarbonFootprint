import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Sidebar from "./Sidebar";
import Cookies from 'js-cookie';
import "./static/UpdateFactors.css";

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

                <h1>Update Conversion Factors</h1>
                <h2></h2>
                <table class="table table-bordered">
                    <thead>
                        <tr class="align-middle text-center">
                        <th scope="col">Name</th>
                        <th scope="col">Current Value</th>
                        <th scope="col">New Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    {conversionFactors.map((factor) => (
                        <tr class="align-middle text-center">
                        <td>{factor.activity}</td>
                        <td>{factor.value}</td>
                        <td><button type="button" class="btn btn-primary btn-sm">Primary</button></td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                
                <div className="button-group">
                    
                    <button
                        className="btn btn-primary"
                        onClick={() => alert("Your request has been submitted!")}
                    >Update
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back
                    </button>
                </div>
            </main>
        </div>
    ) : (
        handleProtect()
    );
}

export default UpdateFactors;

import "../assets/ManageFactors.css";
import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export async function getIntensityFactors(setFactors) {
  await fetch(`${backendUrl}api/intensity-factors/`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to retrieve conversion factors");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      setFactors(data);
    })
    .catch((err) => {
      console.error("failed to retrieve conversion factors", err);
    });
}

export async function getProcurementFactors(setFactors) {
  await fetch(`${backendUrl}api/get-all-carbon-impact/`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to retrieve procurement factors");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      setFactors(data);
    })
    .catch((err) => {
      console.error("failed to retrieve procurement factors", err);
    });
}

export async function handleBulkUpdateSubmissionAPI(event, updatedFactors) {
  event.preventDefault();

  await fetch(`${backendUrl}api/intensity-factors/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(updatedFactors),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update conversion factors");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Updated Factors:", data);
    })
    .catch((err) => {
      console.error("Failed to update conversion factors", err);
    });
}

export async function handleBulkUpdateProcurementSubmissionAPI(event, items) {
  event.preventDefault();

  try {
    const response = await fetch(`${backendUrl}api/update-carbon-impact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
      body: JSON.stringify(items)
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('Bulk update successful:', data);
      return data;
    } else {
      console.error('Bulk update failed:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error with bulk update:', error);
    throw error;
  }
};

// // Example usage
// const items = [
//   { category: "Electronics", carbon_impact: 15.2 },
//   { category: "Paper Products", carbon_impact: 7.5 },
//   { category: "Transportation", carbon_impact: 25.0 }
// ];

// updateMultipleCarbonImpacts(items);

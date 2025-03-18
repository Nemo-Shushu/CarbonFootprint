import "../assets/ManageFactors.css";
import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export async function getConversionFactors(setFactors) {
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

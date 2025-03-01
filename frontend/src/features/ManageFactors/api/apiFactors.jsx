import "../assets/ManageFactors.css";
import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export async function getConversionFactors(setFactors) {
  await fetch(backendUrl + "api/accounts/conversion-factors/", {
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

export async function handleUpdateSubmissionAPI(event, selectedFactor) {
  event.preventDefault();
  await fetch(
    backendUrl + "api/accounts/conversion-factors/" + selectedFactor.id,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(selectedFactor),
    },
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to update conversion factors");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error("failed to update conversion factors", err);
    });
}

export async function handleCreateSubmissionAPI(event, factor) {
  event.preventDefault();
  await fetch(backendUrl + "api/accounts/conversion-factors/", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ activity: factor.activity, value: factor.value }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to create new conversion factor");
      }
      return response.json();
    })
    .catch((err) => {
      console.error("failed to create conversion factors", err);
    });
}

export async function handleDeleteSubmissionAPI(event, selectedFactor) {
  event.preventDefault();
  console.log(event);
  await fetch(
    backendUrl + "api/accounts/conversion-factors/" + selectedFactor.id,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    },
  )
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error("unable to delete specified conversion factor", err);
    });
}

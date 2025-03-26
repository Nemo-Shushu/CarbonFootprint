import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function BenchmarkTable() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [universityData, setUniversityData] = useState({
    floor_area: "",
    electricity_non_residential: "",
    electricity_residential: "",
    gas_non_residential: "",
    gas_residential: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [csrftoken, setCsrfToken] = useState();

  // Fetch all universities on component mount
  useEffect(() => {
    fetchUniversities();
    setCsrfToken(Cookies.get("csrftoken"));
  }, []);

  const fetchUniversities = async () => {
    try {
      setFetchingData(true);
      const response = await fetch(
        `${backendUrl}api/retrieve-accounts-university/`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure we're setting an array to universities state
      if (Array.isArray(data)) {
        // Sort the universities alphabetically if data is an array of university objects
        if (data[0] && Array.isArray(data[0])) {
          data[0].sort((a, b) => a.name.localeCompare(b.name));
        }
        setUniversities(data);
      } else if (data && typeof data === "object") {
        // If the response is an object but not an array, try to convert it
        // This handles cases where the API returns {0: university1, 1: university2, ...}
        // or other object formats that should be arrays
        const universitiesArray = Object.values(data);

        if (
          Array.isArray(universitiesArray) &&
          universitiesArray.length > 0 &&
          Array.isArray(universitiesArray[0])
        ) {
          // Sort the inner array alphabetically by university name
          universitiesArray[0].sort((a, b) => a.name.localeCompare(b.name));
        }

        setUniversities(
          Array.isArray(universitiesArray) ? universitiesArray : [],
        );
      } else {
        // If we can't make sense of the data, set an empty array
        console.error("Unexpected API response format:", data);
        setUniversities([]);
        setMessage({
          type: "danger",
          text: "Failed to parse university data from server",
        });
      }

      setFetchingData(false);
    } catch (error) {
      console.error("Error fetching universities:", error);
      setMessage({ type: "danger", text: "Failed to fetch universities" });
      setUniversities([]); // Ensure it's an empty array on error
      setFetchingData(false);
    }
  };

  // Handle university selection
  const handleUniversityChange = (e) => {
    const uniName = e.target.value;
    setSelectedUniversity(uniName);

    if (uniName) {
      // Find the selected university data
      const uniData = universities[0].find((uni) => uni.name === uniName);
      if (uniData) {
        setUniversityData({
          floor_area: uniData.floor_area || "",
          electricity_non_residential:
            uniData.electricity_non_residential || "",
          electricity_residential: uniData.electricity_residential || "",
          gas_non_residential: uniData.gas_non_residential || "",
          gas_residential: uniData.gas_residential || "",
        });
      }
    } else {
      // Reset form if no university is selected
      setUniversityData({
        floor_area: "",
        electricity_non_residential: "",
        electricity_residential: "",
        gas_non_residential: "",
        gas_residential: "",
      });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUniversityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUniversity) {
      setMessage({ type: "warning", text: "Please select a university" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const payload = [
        {
          name: selectedUniversity,
          floor_area: parseFloat(universityData.floor_area) || null,
          electricity_non_residential:
            parseFloat(universityData.electricity_non_residential) || null,
          electricity_residential:
            parseFloat(universityData.electricity_residential) || null,
          gas_non_residential:
            parseFloat(universityData.gas_non_residential) || null,
          gas_residential: parseFloat(universityData.gas_residential) || null,
        },
      ];

      const response = await fetch(
        `${backendUrl}api/update-accounts-university/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        setMessage({
          type: "success",
          text: "University data updated successfully",
        });
        // Refresh the universities data
        fetchUniversities();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating university data:", error);
      setMessage({
        type: "danger",
        text: "Failed to update university data",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage University Benchmarks</h2>

      {fetchingData ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {message.text && (
            <Alert
              variant={message.type}
              dismissible
              onClose={() => setMessage({ type: "", text: "" })}
            >
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select University</Form.Label>
              <Form.Select
                value={selectedUniversity}
                onChange={handleUniversityChange}
              >
                <option value="">-- Select University --</option>
                {Array.isArray(universities) &&
                universities.length > 0 &&
                Array.isArray(universities[0]) ? (
                  universities[0].map((uni) => (
                    <option key={uni.name} value={uni.name}>
                      {uni.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No universities available</option>
                )}
              </Form.Select>
            </Form.Group>
            {selectedUniversity && (
              <>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Group>
                      <Form.Label>Floor Area (m²)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="floor_area"
                        value={universityData.floor_area}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Group>
                      <Form.Label>
                        Electricity: Non Residential (kWh)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="electricity_non_residential"
                        value={universityData.electricity_non_residential}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Group>
                      <Form.Label>Electricity: Residential (kWh)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="electricity_residential"
                        value={universityData.electricity_residential}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Group>
                      <Form.Label>Gas: Non Residential (kWh)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="gas_non_residential"
                        value={universityData.gas_non_residential}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Group>
                      <Form.Label>Gas: Residential (kWh)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="gas_residential"
                        value={universityData.gas_residential}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Updating...
                    </>
                  ) : (
                    "Update University Data"
                  )}
                </Button>
              </>
            )}
          </Form>
        </>
      )}
    </div>
  );
}

export default BenchmarkTable;

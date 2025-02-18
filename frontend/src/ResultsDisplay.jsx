import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/frontpage.css";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export default function ResultsDisplay({ calculations, rawData }) {
  const [transformedData, setTransformedData] = useState([]);
  const [totalCarbonEmissions, setTotalCarbonEmissions] = useState(null);
  const [formattedRawData, setFormattedRawData] = useState({});

  useEffect(() => {
    if (Array.isArray(calculations)) {
      let extractedCarbon = null;

      const processedData = calculations.flatMap((item, index) =>
        Object.entries(item)
          .map(([key, value], i) => {
            if (key === "total_carbon_emissions") {
              extractedCarbon = value; // Capture total_carbon_emissions separately
              return null; // Remove it from the transformed data
            }
            return {
              id: index * 100 + i,
              value: value,
              label: formatLabel(key), // Format key to "Title Case"
            };
          })
          .filter(Boolean) // Remove null values
      );

      setTransformedData(processedData);
      setTotalCarbonEmissions(extractedCarbon);
    }
  }, [calculations]);

  useEffect(() => {
    if (rawData && typeof rawData === "object") {
      const formattedList = {};

      Object.entries(rawData).forEach(([category, items]) => {
        formattedList[formatLabel(category)] = Object.entries(items).map(([key, value]) => ({
          label: formatLabel(key), // Convert keys to Title Case
          value: value,
        }));
      });

      setFormattedRawData(formattedList);
    }
  }, [rawData]);

  // Convert snake_case to Title Case
  function formatLabel(text) {
    return text
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  }

  return (
    <div>
      {totalCarbonEmissions !== null && (
        <div className="carbon-emissions">
          <h4>Total Carbon Emissions: {totalCarbonEmissions}</h4>
        </div>
      )}

      <PieChart
        colors={["#00843D", "#385A4F", "#7A6855", "#4F5961", "#7D2239", "#5B4D94"]}
        series={[
          {
            data: transformedData,
            arcLabel: (item) => `${item.value}%`,
            arcLabelMinAngle: 40,
            arcLabelRadius: '65%',
            innerRadius: 25,
            paddingAngle: 3,
            cornerRadius: 3,
            cx: 100,
            cy: 100,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "#FFFFFF", // Change label text color
            fontSize: 14,    // Adjust font size
            fontWeight: "bold",
          },
        }}
        width={500}
        height={200}
      />

      {/* Display rawData list */}
      <div className="mt-3">
        <h4>Data contributing to emissions:</h4>
        {Object.entries(formattedRawData).map(([category, items]) => (
          <div key={category} className="mb-3">
            <h5>{category}</h5>
            <ul className="list-group">
              {items.map((item, index) => (
                <li key={index} className="list-group-item">
                  <strong>{item.label}:</strong> {item.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "./static/frontpage.css";

ResultsDisplay.propTypes = {
  calculations: PropTypes.object,
  rawData: PropTypes.object,
};

export default function ResultsDisplay({ calculations, rawData }) {
  const [transformedData, setTransformedData] = useState([]);
  const [totalCarbonEmissions, setTotalCarbonEmissions] = useState(null);
  const [formattedRawData, setFormattedRawData] = useState({});
  const [colors] = useState([
    "#00843D",
    "#385A4F",
    "#7A6855",
    "#4F5961",
    "#7D2239",
    "#5B4D94",
  ]);

  useEffect(() => {
    if (calculations && typeof calculations === "object") {
      let extractedCarbon = null;
      Object.entries(calculations).map(([key, value]) => {
        if (key === "total_carbon_emissions") {
          extractedCarbon = value;
        }
      });

      const processedData = Object.entries(calculations)
        .map(([key, value], i) => {
          if (key === "total_carbon_emissions") {
            extractedCarbon = value;
            return null;
          }
          return {
            id: i,
            value: value,
            label: formatLabel(key),
            percent: ((value * 100) / extractedCarbon).toFixed(1),
          };
        })
        .filter(Boolean);

      setTransformedData(processedData);
      setTotalCarbonEmissions(extractedCarbon);
    }
  }, [calculations]);

  useEffect(() => {
    if (rawData && typeof rawData === "object") {
      const formattedList = {};

      Object.entries(rawData).forEach(([category, items]) => {
        formattedList[formatLabel(category)] = Object.entries(items).map(
          ([key, value]) => ({
            label: formatLabel(key), // Convert keys to Title Case
            value: value,
          }),
        );
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
          <h4>Total Carbon Emissions: {totalCarbonEmissions} tCO²e</h4>
        </div>
      )}
      <div className="d-flex flex-row" style={{ width: "100%" }}>
        <span style={{ alignContent: "center", width: 200 }}>
          <PieChart
            colors={colors}
            series={[
              {
                data: transformedData,
                arcLabel: (item) => `${item.percent}%`,
                arcLabelMinAngle: 40,
                innerRadius: 25,
                outerRadius: 95,
                paddingAngle: 3,
                cornerRadius: 3,
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "#FFFFFF", // Change label text color
                fontSize: 16, // Adjust font size
                fontWeight: "bold",
              },
            }}
            width={200}
            height={200}
            margin={{ right: 0 }}
          />
        </span>
        <span style={{ alignContent: "center", paddingLeft: "1rem" }}>
          <div className="fst-italic">
            {transformedData.map(
              (item, index) =>
                item.value !== 0 && (
                  <div key={item.id} className="p-1">
                    <span
                      style={{
                        backgroundColor: colors[index],
                        color: colors[index],
                      }}
                    >
                      txt
                    </span>
                    <span>
                      {item.label}:{" "}
                      <strong>
                        {item.value} tCO²e ({item.percent}%)
                      </strong>
                    </span>
                  </div>
                ),
            )}
          </div>
        </span>
      </div>

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

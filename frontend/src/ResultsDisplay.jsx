import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/frontpage.css";
import { PieChart } from "@mui/x-charts/PieChart";

export default function ResultsDisplay({ data }) {
  const [transformedData, setTransformedData] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const processedData = data.flatMap((item, index) => transformResponse(item, index));
      setTransformedData(processedData);
    }
  }, [data]);

  function transformResponse(input, baseIndex) {
    return Object.entries(input).map(([key, value], index) => ({
      id: baseIndex * 100 + index, // Ensure unique IDs across multiple objects
      value: value,
      label: key,
    }));
  }

  return (
    <PieChart
      series={[
        {
          data: transformedData, // Corrected key to "data"
        },
      ]}
      width={400}
      height={200}
    />
  );
}
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const ProductPerformanceChart = () => {
  // Dummy-Daten 
  const data = [
    { week: "KW 1", sales: 400 },
    { week: "KW 2", sales: 600 },
    { week: "KW 3", sales: 900 },
    { week: "KW 4", sales: 850 },
    { week: "KW 5", sales: 1200 },
    { week: "KW 6", sales: 950 }
  ];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        color: "#111",
        width: "100%",
        marginTop: "32px"
      }}
    >
      <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px" }}>
        Performance nach Launch
      </h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductPerformanceChart;

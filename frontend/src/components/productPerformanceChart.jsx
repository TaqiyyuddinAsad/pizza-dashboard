import React, { useState } from "react";
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
  // Dummy-Daten für Chart
  const data = [
    { week: "KW 1", sales: 400 },
    { week: "KW 2", sales: 600 },
    { week: "KW 3", sales: 900 },
    { week: "KW 4", sales: 850 },
    { week: "KW 5", sales: 1200 },
    { week: "KW 6", sales: 950 }
  ];

  // Filterzustände (Dummy)
  const [dateRange, setDateRange] = useState("2024-01-01 – 2024-12-31");
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("all");
  const [store, setStore] = useState("all");

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
      {/* Filterleiste */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
          alignItems: "center"
        }}
      >
        {/* Zeitraum */}
        <input
          type="text"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{ padding: "8px", flexGrow: 1, minWidth: "160px" }}
          placeholder="Zeitraum"
        />

        {/* Kategorie */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px", minWidth: "140px" }}
        >
          <option value="all">Kategorie</option>
          <option value="pizza">Pizza</option>
          <option value="pasta">Pasta</option>
          <option value="salad">Salat</option>
        </select>

        {/* Größe */}
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={{ padding: "8px", minWidth: "120px" }}
        >
          <option value="all">Größe</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        {/* Filiale */}
        <select
          value={store}
          onChange={(e) => setStore(e.target.value)}
          style={{ padding: "8px", minWidth: "140px" }}
        >
          <option value="all">Alle Filialen</option>
          <option value="dietzenbach">Dietzenbach</option>
          <option value="frankfurt">Frankfurt</option>
        </select>
      </div>

      <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px" }}>
        Performance nach Launch
      </h3>

      {/* Liniendiagramm */}
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

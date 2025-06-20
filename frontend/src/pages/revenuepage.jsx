import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/RevenuePage.css";
import { fetchRevenueData } from "../services/revenue";
import FilterBar from "../components/filterbar";

const RevenuePage = () => {
  const [data, setData] = useState([]);

  const handleApplyFilters = (filters) => {
    const params = new URLSearchParams();

    if (filters.start && filters.end) {
      params.append("start", filters.start.toString());
      params.append("end", filters.end.toString());
    }
    if (filters.stores?.length) {
      params.append("stores", filters.stores.join(","));
    }
    if (filters.categories?.length) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.sizes?.length) {
      params.append("sizes", filters.sizes.join(","));
    }

    fetchRevenueData(params.toString())
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to load revenue data:", err));
      console.log(params.toString())
  };

  const chartData = {
    labels: data.map((entry) => entry.label),
    datasets: [
      {
        label: "Umsatz (€)",
        data: data.map((entry) => entry.revenue),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.3,
      },
    ],
  };

  const totalRevenue = data.reduce((sum, d) => sum + Number(d.revenue), 0);

  return (
    <div className="revenue-container">
      <h1 className="page-title">Finanzen</h1>
      

      <div className="revenue-card">
        <div className="card-header">
          <div className="revenue-summary">
            <p className="revenue-title">Gesamtumsatz</p>
            <p className="revenue-value">
              {totalRevenue.toLocaleString("de-DE")}€
            </p>
          </div>

          
        </div>

        <div className="revenue-chart">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;

import React, { useState, useEffect, useContext } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/RevenuePage.css";
import { fetchRevenueData } from "../services/revenue";
import { FilterContext } from "../layout/layout";

const RevenuePage = () => {
  const { filters } = useContext(FilterContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (filters.start && filters.end) {
      const params = new URLSearchParams();
      params.append("start", filters.start);
      params.append("end", filters.end);
      
      if (filters.stores?.length) {
        filters.stores.forEach(store => params.append("stores", store));
      }
      if (filters.categories?.length) {
        filters.categories.forEach(category => params.append("categories", category));
      }
      if (filters.sizes?.length) {
        filters.sizes.forEach(size => params.append("sizes", size));
      }

      console.log("💰 Revenue Request:", params.toString());

      fetchRevenueData(params.toString())
        .then((data) => {
          console.log("💰 Revenue Data:", data);
          setData(data);
        })
        .catch((err) => console.error("Failed to load revenue data:", err));
    }
  }, [filters]);

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

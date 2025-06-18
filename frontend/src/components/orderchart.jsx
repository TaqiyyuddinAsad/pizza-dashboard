import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { fetchOrdersData } from "../services/orderService";
import "../styles/OrdersChart.css";

const OrdersChart = ({ filters }) => {
  const [data, setData] = useState([]);

  
  useEffect(() => {
    if (filters.start && filters.end) {
      const params = new URLSearchParams();
      params.append("start", filters.start.toString());
      params.append("end", filters.end.toString());
      if (filters.stores?.length) params.append("stores", filters.stores.join(","));
      if (filters.categories?.length) params.append("categories", filters.categories.join(","));
      if (filters.sizes?.length) params.append("sizes", filters.sizes.join(","));

      fetchOrdersData(params.toString())
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error("Failed to load order data:", err));
    }
  }, [filters]);

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: "Bestellungen",
        data: data.map(d => d.orders),
        backgroundColor: "rgba(139, 92, 246, 0.3)",
        borderColor: "#8b5cf6",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OrdersChart;

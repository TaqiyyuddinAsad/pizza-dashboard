import React, { useEffect, useState, memo } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { fetchOrdersData } from "../services/orderService";
import "../styles/OrdersChart.css";

const OrdersChart = memo(({ filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filters?.start || !filters?.end) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("start", filters.start.toString());
    params.append("end", filters.end.toString());
    if (filters.stores?.length) params.append("stores", filters.stores.join(","));
    if (filters.categories?.length) params.append("categories", filters.categories.join(","));
    if (filters.sizes?.length) params.append("sizes", filters.sizes.join(","));

    fetchOrdersData(params.toString())
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.error("Failed to load order data:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading) {
    return (
      <div className="chart-wrapper" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px' 
      }}>
        <div>Lade Chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-wrapper" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        color: '#d32f2f'
      }}>
        <div>Fehler: {error}</div>
      </div>
    );
  }

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
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  );
});

OrdersChart.displayName = 'OrdersChart';

export default React.memo(OrdersChart);

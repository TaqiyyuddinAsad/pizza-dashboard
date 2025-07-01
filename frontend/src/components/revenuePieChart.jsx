import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RevenuePieChart = ({ filters }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {
      start: filters?.start?.toString(),
      end: filters?.end?.toString(),
      stores: (filters?.stores || []).join(","),
      categories: (filters?.categories || []).join(","),
      sizes: (filters?.sizes || []).join(","),
    };
    const queryString = new URLSearchParams(params).toString();
    fetch(`http://localhost:8080/api/analytics/revenue-per-customer-segments?${queryString}`)
      .then(res => res.json())
      .then(apiData => {
        setData(apiData || []);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [filters]);

  if (loading) {
    return <div>Lade Umsatzverteilung...</div>;
  }
  if (!data || !data.length) {
    return <div>Keine Daten für Piechart.</div>;
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: "Anteil",
        data: data.map(d => d.count),
        backgroundColor: ["#A78BFA", "#F9A8D4", "#60A5FA"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Pie data={chartData} options={options} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
};

export default RevenuePieChart;

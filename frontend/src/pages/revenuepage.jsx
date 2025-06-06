import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/RevenuePage.css";
import DateFilter  from "../components/datefilter"
import { parseDate } from "@internationalized/date";



const RevenuePage = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: parseDate("2024-01-01"),
    end: parseDate("2024-12-31"),
  });

  const fetchRevenue = (startDate, endDate) => {
    if (!startDate || !endDate) return;

    const start = startDate.toString(); // yyyy-MM-dd
    const end = endDate.toString();

    fetch(`http://localhost:8080/api/revenue?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to load revenue data:", err));
  };

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchRevenue(dateRange.start, dateRange.end);
    }
  }, [dateRange]);

  const chartData = {
    labels: data.map((entry) => entry.month),
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

      
    <div className="filters">
      <DateFilter/>
      <select><option>Größe</option></select>
      <select><option>Alle Filialen</option></select>
      <select><option>Kategorie</option></select>
  </div>

    </div>      

        <div className="revenue-chart">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  )
}

export default RevenuePage;

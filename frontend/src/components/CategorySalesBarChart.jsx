import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategorySalesBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Keine Daten</div>;
  const chartData = {
    labels: data.map((row) => row.category),
    datasets: [
      {
        label: "Verkäufe",
        data: data.map((row) => row.quantity),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Sales by Category' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  return (
    <div>
      <Bar data={chartData} options={options} />
      <table style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Kategorie</th>
            <th>Verkäufe</th>
            <th>Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.category}</td>
              <td>{row.quantity}</td>
              <td>{row.revenue}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategorySalesBarChart; 
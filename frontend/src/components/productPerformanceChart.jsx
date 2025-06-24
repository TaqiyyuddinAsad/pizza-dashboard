import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProductPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Keine Daten</div>;
  const chartData = {
    labels: data.map((row) => row.period),
    datasets: [
      {
        label: "Bestellungen",
        data: data.map((row) => row.quantity),
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54,162,235,0.2)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Performance nach Launch' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  return (
    <div>
      <Line data={chartData} options={options} />
      <table style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Woche</th>
            <th>Bestellungen</th>
            <th>Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.period}</td>
              <td>{row.quantity}</td>
              <td>{row.revenue}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPerformanceChart;

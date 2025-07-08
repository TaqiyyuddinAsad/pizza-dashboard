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
  if (!data || data.length === 0) return <div className="dark:text-gray-300">Keine Daten</div>;
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
      <table className="dark:text-gray-300" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th className="dark:text-gray-100">Woche</th>
            <th className="dark:text-gray-100">Bestellungen</th>
            <th className="dark:text-gray-100">Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="dark:text-gray-300">{row.period}</td>
              <td className="dark:text-gray-300">{row.quantity}</td>
              <td className="dark:text-gray-300">{row.revenue}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(ProductPerformanceChart);

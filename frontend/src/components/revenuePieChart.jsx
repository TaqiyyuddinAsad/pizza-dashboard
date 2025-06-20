import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RevenuePieChart = () => {
  const data = {
    labels: ["≤ 15€", "15€ – 50€", "> 50€"],
    datasets: [
      {
        label: "Anteil",
        data: [45, 45, 10],
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
      <Pie data={data} options={options} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
};

export default RevenuePieChart;

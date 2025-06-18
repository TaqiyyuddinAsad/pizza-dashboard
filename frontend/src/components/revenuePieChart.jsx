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
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
      <h2 className="text-sm font-semibold text-gray-800 mb-1">
        Ø Monatsumsatz pro Kunde (segmentiert)
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Berechnet auf Basis der aktiven Nutzungsdauer je Kunde
      </p>
      <Pie data={data} options={options} />
    </div>
  );
};

export default RevenuePieChart;

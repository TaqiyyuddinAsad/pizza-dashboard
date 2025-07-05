import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#FF6384", // Red
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40"  // Orange
];

function OrderPie({ data }) {
  if (!data || !data.length)
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-md">
        <span className="text-slate-500 text-sm">Keine Daten für Piechart.</span>
      </div>
    );

  const chartData = {
    labels: data.map((x) => x.zeitpunkt),
    datasets: [
      {
        label: "Bestellungen",
        data: data.map((x) => x.anzahl),
        backgroundColor: COLORS,
      },
    ],
  };

  // 👉 If all values are zero, show a message instead
  if (chartData.datasets[0].data.reduce((a, b) => a + b, 0) === 0)
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-md">
        <span className="text-slate-500 text-sm">Keine Bestellungen im Zeitraum.</span>
      </div>
    );

  // 👉 Otherwise show the pie
  return (
    <div style={{ width: 340, height: 340, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#334155",
                font: { size: 18 },
                boxWidth: 32,
                boxHeight: 18
              }
            },
            tooltip: { enabled: true },
          },
        }}
      />
    </div>
  );
}

export default OrderPie;

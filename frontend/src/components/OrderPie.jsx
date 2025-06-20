import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#E59B9B", "#B3B2E5", "#E5D1B2"];

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
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] flex items-center justify-center">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { color: "#334155" } },
              tooltip: { enabled: true },
            },
          }}
        />
      </div>
    </div>
  );
}

export default OrderPie;

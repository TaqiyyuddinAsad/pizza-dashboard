import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#E59B9B", "#B3B2E5", "#E5D1B2"];

function OrderPie({ data }) {
  if (!data || !data.length) return <div>Keine Daten für Piechart.</div>;

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

  if (chartData.datasets[0].data.reduce((a, b) => a + b, 0) === 0)
    return <div>Keine Bestellungen im Zeitraum.</div>;

  return (
    <div style={{ width: 300, height: 300 }}>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: { enabled: true },
          },
        }}
      />
    </div>
  );
}

export default OrderPie;

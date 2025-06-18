import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AverageRevenueCard = ({ onClick }) => {
  const averageRevenue = 12.5;

  const chartData = {
    labels: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4'],
    datasets: [
      {
        label: 'Ø Umsatz',
        data: [5000, 7000, 6000, 8000],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1000 },
        grid: { color: '#e5e7eb' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black">Ø Umsatz pro Kunde</h2>
          <p className="text-3xl font-bold text-black">{averageRevenue.toFixed(2)}€</p>
          <p className="text-sm text-gray-500">Letzte 30 Tage</p>
        </div>
        <div className="flex space-x-2">
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>Alle Filialen</option>
            <option>Filiale A</option>
            <option>Filiale B</option>
          </select>
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>Dieser Monat</option>
            <option>Letzter Monat</option>
          </select>
        </div>
      </div>
      <Line data={chartData} options={chartOptions} height={100} />
    </div>
  );
};

export default AverageRevenueCard;

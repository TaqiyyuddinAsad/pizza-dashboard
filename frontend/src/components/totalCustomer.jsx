import React, { useState } from 'react';
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

const TotalCustomersCard = ({ onClick }) => {
  const [year, setYear] = useState('2023');
  const [branch, setBranch] = useState('Alle Filialen');

  const totalCustomers = 22378;
  const changeRate = 37.8;

  const token = localStorage.getItem('token');
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Customers data:', data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: year,
        data: [1200, 1300, 1350, 1400, 1380, 1500, 1600, 1580, 1620, 1650, 1700, 1750],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 500 },
        grid: { color: '#e5e7eb' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl cursor-pointer hover:shadow-lg transition"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black">Gesamtkunden</h2>
          <p className="text-3xl font-bold text-black">{totalCustomers.toLocaleString()} Kunden</p>
          <p className="text-sm text-green-600 mt-1">+{changeRate}% vs 2022</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option>Alle Filialen</option>
            <option>Filiale A</option>
            <option>Filiale B</option>
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option>2023</option>
            <option>2022</option>
          </select>
        </div>
      </div>
      <Line data={chartData} options={chartOptions} height={100} />
    </div>
  );
};

export default React.memo(TotalCustomersCard);

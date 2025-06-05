import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const RevenuePage = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetch('/api/revenue')
      .then(res => res.json())
      .then(data => setRevenueData(data))
      .catch(err => console.error('Failed to load revenue data:', err));
  }, []);

  const chartData = {
    labels: revenueData.map(entry => entry.month),
    datasets: [
      {
        label: 'Umsatz (€)',
        data: revenueData.map(entry => entry.revenue),
        borderColor: '#4b4bb8',
        backgroundColor: 'rgba(75, 75, 184, 0.1)',
        tension: 0.3,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: value => `€ ${value}`,
        },
        grid: { color: '#eee' },
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `€ ${ctx.parsed.y.toLocaleString('de-DE')}`,
        },
      },
    },
  };

  return (
    <div>
      <h2>Umsatzentwicklung</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default RevenuePage;
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = [
  "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#ff6384", "#c9cbcf"
];

const CategorySalesBarChart = ({ fetchCategorySalesTimeline, filters, filterSummary }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCategorySalesTimeline(filters)
      .then(res => {
        setData(res || []);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [fetchCategorySalesTimeline, filters]);

  if (loading) return <div>Lade Daten...</div>;
  if (!data || data.length === 0) return <div>Keine Daten</div>;

  // Get all unique periods and categories
  const periods = Array.from(new Set(data.map(row => row.period)));
  const categories = Array.from(new Set(data.map(row => row.category)));

  // Build datasets for grouped bar chart
  const datasets = categories.map((cat, idx) => ({
    label: cat,
    data: periods.map(period => {
      const found = data.find(row => row.period === period && row.category === cat);
      return found ? parseFloat(found.revenue) : 0;
    }),
    backgroundColor: COLORS[idx % COLORS.length],
  }));

  const chartData = {
    labels: periods,
    datasets,
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Total revenue for all periods/categories
  const totalRevenue = data.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0);

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 16, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: '#111' }}>Umsatz nach Kategorie</span>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#222' }}>
          Umsatz: {totalRevenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </span>
      </div>
      {filterSummary && (
        <div style={{ marginBottom: 12, fontWeight: 500, fontSize: '1.05rem', color: '#222' }}>{filterSummary}</div>
      )}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CategorySalesBarChart; 
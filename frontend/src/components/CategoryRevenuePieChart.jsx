import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const COLORS = [
  '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1', '#ff9800', '#c2185b', '#0097a7', '#8bc34a'
];

const CategoryRevenuePieChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Keine Daten</div>;
  const series = [
    {
      data: data.map((row, idx) => ({ id: row.category, value: row.revenue, label: row.category, color: COLORS[idx % COLORS.length] })),
      innerRadius: 34,
      outerRadius: 100,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: -45,
    },
  ];
  return (
    <PieChart
      series={series}
      width={340}
      height={340}
      slotProps={{ legend: { hidden: false, position: 'bottom' } }}
    />
  );
};

export default CategoryRevenuePieChart; 
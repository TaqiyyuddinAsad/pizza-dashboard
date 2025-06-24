import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const COLORS = [
  "#1976d2", "#388e3c", "#fbc02d", "#d32f2f", "#7b1fa2", "#0288d1"
];

const ProductSizePieChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Keine Daten</div>;
  const chartData = {
    labels: data.map((row) => row.size),
    datasets: [
      {
        data: data.map((row) => row.count),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Verkaufsanteile nach Pizzagröße' },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 16 },
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percent = ((value / total) * 100).toFixed(1) + '%';
          return percent;
        },
      },
    },
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Verkaufsanteile nach Pizzagröße</Typography>
        <Box sx={{ width: 300, mx: 'auto' }}>
          <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductSizePieChart; 
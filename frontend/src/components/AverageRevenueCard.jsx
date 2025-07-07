import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Typography } from "@mui/material";

const AverageRevenueCard = ({ filters }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const params = {
      start: filters.start?.toString(),
      end: filters.end?.toString(),
      stores: (filters.stores || []).join(","),
      categories: (filters.categories || []).join(","),
      sizes: (filters.sizes || []).join(","),
    };
    const queryString = new URLSearchParams(params).toString();

          fetch(`http://localhost:8080/api/customers/revenue-per-customer?${queryString}`)
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Laden der Umsatzdaten");
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, [filters]);

  return (
    <div style={{ width: '100%', height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" gutterBottom style={{ marginBottom: 16 }}>Umsatz pro Kunde</Typography>
      <div style={{ width: '100%', height: 260 }}>
        <Line
          data={{
            labels: data.map(d => d.period),
            datasets: [
              {
                label: "Ø Umsatz pro Kunde",
                data: data.map(d => d.avgRevenuePerCustomer),
                borderWidth: 2,
                fill: false,
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                pointRadius: 4,
                pointHoverRadius: 6,
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } }
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default AverageRevenueCard;

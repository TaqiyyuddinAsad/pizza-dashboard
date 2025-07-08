import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Typography } from "@mui/material";

const AverageRevenueCard = ({ filters }) => {
  const [data, setData] = useState([]);
  const showChart =
    !((filters.categories && filters.categories.length > 0) ||
      (filters.sizes && filters.sizes.length > 0));

  useEffect(() => {
    // Only fetch if categories and sizes are not selected
    if (!showChart) {
      setData([]);
      return;
    }
    const params = {
      start: filters.start?.toString(),
      end: filters.end?.toString(),
      stores: (filters.stores || []).join(","),
      // categories and sizes are intentionally omitted
    };
    const queryString = new URLSearchParams(params).toString();

    fetch(`http://localhost:8080/api/customers/revenue-per-customer?${queryString}`)
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Laden der Umsatzdaten");
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, [filters.start, filters.end, filters.stores, filters.categories, filters.sizes, showChart]);

  return (
    <div style={{ width: '100%', height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" gutterBottom style={{ marginBottom: 16 }}>Umsatz pro Kunde</Typography>
      <div style={{ width: '100%', height: 260 }}>
        {showChart ? (
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
        ) : (
          <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center', marginTop: 32 }}>
            Der Umsatz pro Kunde kann nicht nach Kategorie oder Größe gefiltert werden.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default React.memo(AverageRevenueCard);

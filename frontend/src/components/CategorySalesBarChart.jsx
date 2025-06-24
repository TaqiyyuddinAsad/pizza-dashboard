import React, { useEffect, useState } from 'react';
import { fetchCategorySales } from '../services/productservice';

const CategorySalesBarChart = ({ start, end, stores = [], sizes = [] }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCategorySales(start, end, stores, sizes)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [start, end, stores, sizes]);

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler beim Laden der Daten.</div>;
  if (!data.length) return <div>Keine Daten verfügbar.</div>;

  // Simple bar chart rendering
  const max = Math.max(...data.map(d => d.quantity));

  return (
    <div>
      <h2>Verkäufe nach Kategorien</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: 200 }}>
        {data.map(d => (
          <div key={d.category} style={{ textAlign: 'center' }}>
            <div style={{
              background: '#4f46e5',
              width: 40,
              height: `${(d.quantity / max) * 180}px`,
              borderRadius: 4,
              marginBottom: 8
            }} />
            <div style={{ fontSize: 12 }}>{d.category}</div>
            <div style={{ fontSize: 12, color: '#555' }}>{d.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySalesBarChart; 
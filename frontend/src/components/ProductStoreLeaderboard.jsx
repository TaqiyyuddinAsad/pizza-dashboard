import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';

function useProductStoreLeaderboard({ sku, start, end }) {
  return useQuery({
    queryKey: ['productStoreLeaderboard', sku, start, end],
    queryFn: async () => {
      const params = new URLSearchParams({ sku, start, end });
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/products/best-stores-for-product?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Fehler beim Laden der Store-Liste');
      return res.json();
    },
    enabled: !!sku && !!start && !!end,
    staleTime: 5 * 60 * 1000,
  });
}

export default React.memo(ProductStoreLeaderboard);

function ProductStoreLeaderboard({ products, filters }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.sku || "");
  const selectedProductObj = useMemo(() => products.find(p => p.sku === selectedProduct) || {}, [products, selectedProduct]);
  const sizesForProduct = selectedProductObj.sizes || [];
  const [isDark, setIsDark] = useState(false);

  // Reliable dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Check initially
    checkDarkMode();

    // Listen for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const { data: stores = [], isLoading, error } = useProductStoreLeaderboard({
    sku: selectedProduct,
    start: filters.start,
    end: filters.end,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow" style={{ marginTop: 32 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <select 
          value={selectedProduct} 
          onChange={e => setSelectedProduct(e.target.value)} 
          style={{
            color: isDark ? '#ffffff' : '#000000',
            backgroundColor: isDark ? '#374151' : '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '4px 8px'
          }}
        >
          {products.map(p => (
            <option key={p.sku} value={p.sku} style={{ color: '#000000', backgroundColor: '#ffffff' }}>
              {p.name} {p.sizes && p.sizes.length ? `(${p.sizes.join(", ")})` : ""}
            </option>
          ))}
        </select>
      </div>
      <h3 style={{ 
        fontWeight: 700, 
        marginBottom: 12,
        color: isDark ? '#ffffff' : '#000000'
      }}>
        Standorte für {selectedProductObj.name} {sizesForProduct.length ? `(${sizesForProduct.join(", ")})` : ""}
      </h3>
      {isLoading ? (
        <div style={{ color: isDark ? '#ffffff' : '#000000' }}>Lade...</div>
      ) : error ? (
        <div className="text-red-500">Fehler beim Laden der Daten</div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th style={{ 
                color: isDark ? '#ffffff' : '#000000', 
                padding: '8px 0', 
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 'bold'
              }}>#</th>
              <th style={{ 
                color: isDark ? '#ffffff' : '#000000', 
                padding: '8px 0', 
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 'bold'
              }}>Store</th>
              <th style={{ 
                color: isDark ? '#ffffff' : '#000000', 
                padding: '8px 0', 
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 'bold'
              }}>Orders</th>
              <th style={{ 
                color: isDark ? '#ffffff' : '#000000', 
                padding: '8px 0', 
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 'bold'
              }}>Umsatz</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((row, i) => (
              <tr key={`${selectedProduct}-${row.storeId}`}>
                <td style={{ color: isDark ? '#ffffff' : '#000000', padding: '8px 0' }}>{i + 1}</td>
                <td style={{ color: isDark ? '#ffffff' : '#000000', padding: '8px 0' }}>{row.storeCity} ({row.storeId})</td>
                <td style={{ color: isDark ? '#ffffff' : '#000000', padding: '8px 0' }}>{row.orders}</td>
                <td style={{ color: isDark ? '#ffffff' : '#000000', padding: '8px 0' }}>{row.revenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 
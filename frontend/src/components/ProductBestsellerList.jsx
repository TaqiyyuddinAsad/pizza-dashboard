import React, { useEffect, useState } from "react";

const PAGE_SIZE = 3;

export default function ProductBestsellerList({ filters }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("start", filters.start);
    params.append("end", filters.end);
    if (filters.stores.length) params.append("stores", filters.stores.join(","));
    if (filters.categories.length) params.append("categories", filters.categories.join(","));
    if (filters.sizes.length) params.append("sizes", filters.sizes.join(","));
    params.append("page", page);
    params.append("size", PAGE_SIZE);
    fetch(`http://localhost:8080/products/bestseller?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.items || []);
        setTotal(data.total || 0);
      });
  }, [filters, page]);

  return (
    <div className="bestseller-list card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 18 }}>Bestseller</span>
        {/* Filter- und Zeitraum-Auswahl kann hier ergänzt werden */}
      </div>
      <div>
        {products.map((p, i) => (
          <div key={p.sku} style={{ display: "flex", alignItems: "center", marginBottom: 12, gap: 12 }}>
            <img src={p.imageUrl} alt={p.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{p.name} <span style={{ color: '#888', fontSize: 13 }}>{p.size}</span></div>
              <div style={{ color: '#666', fontSize: 14 }}>{p.price.toFixed(2)}€ Preis</div>
            </div>
            <div style={{ minWidth: 60, textAlign: "right" }}>
              <div style={{ fontWeight: 500 }}>{p.orders}</div>
              <div style={{ color: '#888', fontSize: 13 }}>Bestellungen</div>
            </div>
            <div style={{ minWidth: 70, textAlign: "right" }}>
              <div style={{ fontWeight: 500 }}>{p.revenue.toLocaleString("de-DE")}€</div>
              <div style={{ color: '#888', fontSize: 13 }}>Umsatz</div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8, gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lt;</button>
        <span>{page} / {Math.ceil(total / PAGE_SIZE)}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / PAGE_SIZE)}>&gt;</button>
      </div>
    </div>
  );
} 
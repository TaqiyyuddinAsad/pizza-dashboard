import React, { useState, useEffect } from "react";

const ProductBestsellerList = () => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("bestseller");
  const [storeOption, setStoreOption] = useState("all");
  const [timeOption, setTimeOption] = useState("today");

  useEffect(() => {
    // MOCK-DATEN
    const mockData = [
      { name: "Pizza Margherita", size: "Medium", price: 7.0, orders: 83, revenue: 679 },
      { name: "Pizza Veggie", size: "Large", price: 8.5, orders: 85, revenue: 569 },
      { name: "Sicilian Pizza", size: "Small", price: 9.5, orders: 64, revenue: 453 }
    ];
    setProducts(mockData);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "#111",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "900px",
        margin: "auto"
      }}
    >
      {/* Filter-Leiste */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", gap: "12px", flexWrap: "wrap" }}>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="bestseller">Bestseller</option>
          <option value="revenue">Höchster Umsatz</option>
          <option value="price">Teuerste Produkte</option>
        </select>

        <select value={storeOption} onChange={(e) => setStoreOption(e.target.value)}>
          <option value="all">Alle Filialen</option>
          <option value="dietzenbach">Dietzenbach</option>
          <option value="frankfurt">Frankfurt</option>
        </select>

        <select value={timeOption} onChange={(e) => setTimeOption(e.target.value)}>
          <option value="today">Heute</option>
          <option value="7days">Letzte 7 Tage</option>
          <option value="30days">Letzte 30 Tage</option>
        </select>
      </div>

      <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
        Bestseller
      </h3>

      {/* Tabelle */}
      <table style={{ width: "100%", borderCollapse: "collapse", color: "#111" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", paddingBottom: "8px" }}>Produkt</th>
            <th style={{ textAlign: "left", paddingBottom: "8px" }}>Preis</th>
            <th style={{ textAlign: "left", paddingBottom: "8px" }}>Bestellungen</th>
            <th style={{ textAlign: "left", paddingBottom: "8px" }}>Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px 0" }}>
                <strong>{p.name}</strong>
                <br />
                <span style={{ fontSize: "0.85rem", color: "#666" }}>{p.size}</span>
              </td>
              <td>{p.price.toFixed(2)} €</td>
              <td>{p.orders}</td>
              <td>{p.revenue.toFixed(0)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ergebnisanzeige */}
      <p style={{ marginTop: "12px", fontSize: "0.9rem", color: "#666" }}>
        3 von 25 Ergebnissen
      </p>
    </div>
  );
};

export default ProductBestsellerList;

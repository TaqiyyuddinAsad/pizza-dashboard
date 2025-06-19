import React, { useState, useEffect } from "react";

const PopularCombinations = () => {
  const [combinations, setCombinations] = useState([]);
  const [storeOption, setStoreOption] = useState("all");
  const [sortOption, setSortOption] = useState("total");

  useEffect(() => {
    // MOCK-DATEN
    const mock = [
      {
        combo: "Pizza Veggie (small) + Pizza Veggie (extra large)",
        count: 12361,
        image: "https://via.placeholder.com/40"
      },
      {
        combo: "Pizza Veggie (small) + Pizza Chicken BBQ (small)",
        count: 9947,
        image: "https://via.placeholder.com/40"
      },
      {
        combo: "Pizza Margherita (small) + Pizza Veggie (small)",
        count: 9355,
        image: "https://via.placeholder.com/40"
      }
    ];
    setCombinations(mock);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        color: "#111",
        width: "100%",
        maxWidth: "500px"
      }}
    >
      
      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="total">Gesamt</option>
          <option value="weekly">Diese Woche</option>
        </select>
        <select value={storeOption} onChange={(e) => setStoreOption(e.target.value)}>
          <option value="all">Alle Filialen</option>
          <option value="dietzenbach">Dietzenbach</option>
        </select>
      </div>

      <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px" }}>
        Beliebteste Kombinationen
      </h3>

      {combinations.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid #eee",
            padding: "8px 0"
          }}
        >
          <img src={item.image} alt="combo" width="40" height="40" style={{ borderRadius: "4px" }} />
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{item.combo}</div>
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>{item.count.toLocaleString()} mal</div>
        </div>
      ))}
    </div>
  );
};

export default PopularCombinations;

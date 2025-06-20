import React, { useState } from "react";
import FilterBar from "../components/filterbar";
import ProductBestsellerList from "../components/ProductBestsellerList";
// Platzhalter für neue Komponenten:
// import ProductBestsellerList from "../components/ProductBestsellerList";
// import ProductCombinationsList from "../components/ProductCombinationsList";
// import ProductPerformanceChart from "../components/ProductPerformanceChart";
// import ProductPieChart from "../components/ProductPieChart";

const ProductPage = () => {
  const [filters, setFilters] = useState({
    start: new Date().toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
    stores: [],
    categories: [],
    sizes: [],
  });

  // TODO: States für Pagination, ausgewähltes Produkt etc.

  return (
    <div className="product-analysis-page" style={{ padding: 32 }}>
      <h1 className="page-title">Waren - Analyse</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="product-analysis-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: 24, marginTop: 24 }}>
        {/* Bestseller-Liste */}
        <div style={{ gridColumn: '1/2' }}>
          <ProductBestsellerList filters={filters} />
        </div>
        {/* Kombinationen-Liste */}
        <div style={{ gridColumn: '2/3' }}>
          {/* <ProductCombinationsList filters={filters} /> */}
          <div className="card">Beliebteste Kombinationen (Platzhalter)</div>
        </div>
        {/* Performance-Chart */}
        <div style={{ gridColumn: '1/2', marginTop: 24 }}>
          {/* <ProductPerformanceChart filters={filters} /> */}
          <div className="card">Performance-Chart (Platzhalter)</div>
        </div>
        {/* Piechart */}
        <div style={{ gridColumn: '2/3', marginTop: 24 }}>
          {/* <ProductPieChart filters={filters} /> */}
          <div className="card">Piechart nach Größe (Platzhalter)</div>
        </div>
      </div>
      {/* TODO: Pagination-Komponenten */}
    </div>
  );
};

export default ProductPage; 
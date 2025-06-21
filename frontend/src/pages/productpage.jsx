import React from "react";
import ProductBestsellerList from "../components/ProductBestsellerList";
// Platzhalter für neue Komponenten:
// import ProductCombinationsList from "../components/ProductCombinationsList";
// import ProductPerformanceChart from "../components/ProductPerformanceChart";
// import ProductPieChart from "../components/ProductPieChart";

const ProductPage = () => {
  // TODO: States für Pagination, ausgewähltes Produkt etc.

  return (
    <div className="product-analysis-page" style={{ padding: 32 }}>
      <h1 className="page-title">Waren - Analyse</h1>
      <div className="product-analysis-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: 24, marginTop: 24 }}>
        {/* Bestseller-Liste */}
        <div style={{ gridColumn: '1/2' }}>
          <ProductBestsellerList />
        </div>
        {/* Kombinationen-Liste */}
        <div style={{ gridColumn: '2/3' }}>
          {/* <ProductCombinationsList /> */}
          <div className="card">Beliebteste Kombinationen (Platzhalter)</div>
        </div>
        {/* Performance-Chart */}
        <div style={{ gridColumn: '1/2', marginTop: 24 }}>
          {/* <ProductPerformanceChart /> */}
          <div className="card">Performance-Chart (Platzhalter)</div>
        </div>
        {/* Piechart */}
        <div style={{ gridColumn: '2/3', marginTop: 24 }}>
          {/* <ProductPieChart /> */}
          <div className="card">Piechart nach Größe (Platzhalter)</div>
        </div>
      </div>
      {/* TODO: Pagination-Komponenten */}
    </div>
  );
};

export default ProductPage; 
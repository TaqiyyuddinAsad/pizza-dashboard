import React from "react";
import ProductBestsellerList from "../components/ProductBestsellerList";

const ProductPage = () => {

  return (
    <div className="product-analysis-page" style={{ padding: 32 }}>
      <h1 className="page-title">Waren - Analyse</h1>
      <div className="product-analysis-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: 24, marginTop: 24 }}>
        <div style={{ gridColumn: '1/2' }}>
          <ProductBestsellerList />
        </div>
        <div style={{ gridColumn: '2/3' }}>
          <div className="card">Beliebteste Kombinationen (Platzhalter)</div>
        </div>
        <div style={{ gridColumn: '1/2', marginTop: 24 }}>
          <div className="card">Performance-Chart (Platzhalter)</div>
        </div>
        <div style={{ gridColumn: '2/3', marginTop: 24 }}>
          <div className="card">Piechart nach Größe (Platzhalter)</div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 
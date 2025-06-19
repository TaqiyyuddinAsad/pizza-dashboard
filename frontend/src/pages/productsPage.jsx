import React from "react";
import ProductBestsellerList from "../components/productsBestseller.jsx";
import PopularCombinations from "../components/popularCombinations.jsx";
import Layout from "../layout/layout";

const ProductPage = () => {
  return (
    <Layout>
      <div className="p-6" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h2 className="text-2xl font-semibold mb-4">Waren – Analyse</h2>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            flexWrap: "nowrap"
          }}
        >
          {/* Linke Box: Bestseller */}
          <div style={{ flex: 1, minWidth: "0", maxWidth: "850px" }}>
            <ProductBestsellerList />
          </div>

          {/* Rechte Box: Kombinationen */}
          <div style={{ width: "420px", flexShrink: 0 }}>
            <PopularCombinations />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

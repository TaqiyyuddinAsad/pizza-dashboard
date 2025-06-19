import React from "react";
import ProductBestsellerList from "../components/productsBestseller.jsx";
import PopularCombinations from "../components/popularCombinations.jsx";
import Layout from "../layout/layout";

const ProductPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Waren – Analyse</h2>

        
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-start"
          }}
        >
          
          <div style={{ flex: 1, minWidth: "500px" }}>
            <ProductBestsellerList />
          </div>

          
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <PopularCombinations />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

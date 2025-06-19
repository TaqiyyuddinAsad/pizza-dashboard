import React from "react";
import ProductBestsellerList from "../components/productsBestseller.jsx";
import Layout from "../layout/layout"; 

const ProductPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Waren – Analyse</h2>

        <div className="bg-white rounded-xl shadow-md p-6">
          <ProductBestsellerList />
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

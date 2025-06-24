import React, { useState, useEffect } from "react";
import FilterBar from "../components/filterbar";
import ProductBestsellerList from "../components/ProductBestsellerList";
import ProductCombinationsList from "../components/ProductCombinationsList";
import ProductPerformanceChart from "../components/productPerformanceChart";
import CategorySalesBarChart from "../components/CategorySalesBarChart";
import ProductSizePieChart from "../components/ProductSizePieChart";
import { fetchBestsellers, fetchCombinations, fetchPerformance, fetchPieBySize, fetchCategorySales } from "../services/productservice";

const ProductsPage = () => {
  // Filter state
  const [filters, setFilters] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
    stores: [],
    categories: [],
    sizes: [],
  });
  const [bestsellers, setBestsellers] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [pieBySize, setPieBySize] = useState([]);
  const [showPerformance, setShowPerformance] = useState(true);

  // Fetch data on filter change
  useEffect(() => {
    fetchBestsellers(filters).then(res => setBestsellers(res.data));
    fetchCombinations(filters).then(res => setCombinations(res.data));
    fetchCategorySales(filters).then(res => setCategorySales(res.data));
    fetchPieBySize(filters).then(res => setPieBySize(res.data));
    // For performance, you may want to pass a specific SKU
    // fetchPerformance({ ...filters, sku: "SKU123" }).then(res => setPerformance(res.data));
  }, [filters]);

  return (
    <div className="product-analysis-page">
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="top-section" style={{ display: "flex", gap: "2rem" }}>
        <ProductBestsellerList data={bestsellers} filters={filters} setFilters={setFilters} />
        <ProductCombinationsList data={combinations} filters={filters} setFilters={setFilters} />
      </div>
      <div className="bottom-section" style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div style={{ flex: 2 }}>
          <div>
            <button onClick={() => setShowPerformance(true)}>Performance nach Launch</button>
            <button onClick={() => setShowPerformance(false)}>Sales by Category</button>
          </div>
          {showPerformance ? (
            <ProductPerformanceChart data={performance} filters={filters} />
          ) : (
            <CategorySalesBarChart data={categorySales} filters={filters} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <ProductSizePieChart data={pieBySize} filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

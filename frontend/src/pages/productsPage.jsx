import React, { useState, useEffect } from "react";
// import FilterBar from "../components/filterbar"; // Removed, now global
import ProductBestsellerList from "../components/ProductBestsellerList";
import ProductCombinationsList from "../components/ProductCombinationsList";
import ProductPerformanceChart from "../components/productPerformanceChart";
import CategorySalesBarChart from "../components/CategorySalesBarChart";
import ProductSizePieChart from "../components/ProductSizePieChart";
import { fetchBestsellers, fetchCombinations, fetchPerformance, fetchPieBySize, fetchCategorySales } from "../services/productservice";

const defaultStart = "2021-01-01";
const defaultEnd = "2021-12-31";

const ProductsPage = () => {
  // Filter state
  const [filters, setFilters] = useState({
    start: defaultStart,
    end: defaultEnd,
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
    if (!filters.start || !filters.end) return;
    fetchBestsellers(filters)
      .then(res => setBestsellers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBestsellers([]));
    fetchCombinations(filters)
      .then(res => setCombinations(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCombinations([]));
    fetchCategorySales(filters)
      .then(res => setCategorySales(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategorySales([]));
    fetchPieBySize(filters)
      .then(res => setPieBySize(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPieBySize([]));
    // For performance, you may want to pass a specific SKU
    // fetchPerformance({ ...filters, sku: "SKU123" }).then(res => setPerformance(res.data));
  }, [filters]);

  return (
    <div className="product-analysis-page">
      {/* FilterBar removed from here, should be global */}
      <div className="top-section" style={{ display: "flex", gap: "2rem" }}>
        <ProductBestsellerList data={bestsellers || []} filters={filters} setFilters={setFilters} />
        <ProductCombinationsList data={combinations || []} filters={filters} setFilters={setFilters} />
      </div>
      <div className="bottom-section" style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div style={{ flex: 2 }}>
          <div>
            <button onClick={() => setShowPerformance(true)}>Performance nach Launch</button>
            <button onClick={() => setShowPerformance(false)}>Sales by Category</button>
          </div>
          {showPerformance ? (
            <ProductPerformanceChart data={performance || []} filters={filters} />
          ) : (
            <CategorySalesBarChart data={categorySales || []} filters={filters} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <ProductSizePieChart data={pieBySize || []} filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

import { useEffect, useState } from "react";
import { fetchProductRanking } from "../services/productService";
import { fetchStoreRanking } from "../services/storeService";
import { parseDate } from "@internationalized/date";
import OrdersChart from "../components/orderchart";
import FilterBar from "../components/filterbar";
import KpiGrid from "../components/KpiGrid";
import ProductLeaderboard from "../components/ProductLeaderboard"; 
import StoreLeaderboard from "../components/StoreLeaderboard";
import "../styles/OrdersPage.css";

const OrdersPage = () => {
  const [filters, setFilters] = useState({
    start: parseDate("2020-06-01"),
    end: parseDate("2020-07-01"),
    stores: [],
    categories: [],
    sizes: [],
  });

  // --- State für Rankings ---
  const [productRanking, setProductRanking] = useState([]);
  const [storeRanking, setStoreRanking] = useState([]);

  // --- Fetch Rankings bei Filter-Änderung ---
  useEffect(() => {
    const start = filters.start.toString();
    const end = filters.end.toString();

    fetchProductRanking(start, end).then(setProductRanking);

    fetchStoreRanking(start, end).then(setStoreRanking);
  }, [filters]);

  return (
    <div className="orders-page">
      <FilterBar onApplyFilters={setFilters} />
      <div className="orders-container">
        <div className="orders-chart-wrapper">
          <OrdersChart filters={filters} />
        </div>
        <div className="orders-kpi-wrapper">
          <KpiGrid filters={filters} />
        </div>
      </div>
      <div className="down-part">
      <div className="orders-ranking-wrapper" style={{
  display: "flex",
  gap: "32px",
  justifyContent: "flex-start",   
  alignItems: "flex-start",
  flexWrap: "wrap"
}}>
  <div style={{ flex: 1, maxWidth: 340 }}>
    <ProductLeaderboard ranking={productRanking} />
  </div>
  <div style={{ flex: 1, maxWidth: 340 }}>
    <StoreLeaderboard ranking={storeRanking} />
  </div>
  
  </div>
</div>

    </div>
  );
};

export default OrdersPage;

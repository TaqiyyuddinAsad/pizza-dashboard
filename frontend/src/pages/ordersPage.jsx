import { parseDate } from "@internationalized/date";
import { useState } from "react";
import OrdersChart from "../components/orderchart";
import FilterBar from "../components/filterbar";
import KpiGrid from "../components/KpiGrid";
import ProductRanking from "../components/productranking"; // ← hinzufügen
import "../styles/OrdersPage.css";

const OrdersPage = () => {
  const [filters, setFilters] = useState({
    start: parseDate("2020-06-01"),
    end: parseDate("2020-07-01"),
    stores: [],
    categories: [],
    sizes: [],
  });

  return (
    <div className="orders-page">
      {/* Filter above all */}
      <FilterBar onApplyFilters={setFilters} />

      {/* Chart and KPI layout container */}
      <div className="orders-container">
        <div className="orders-chart-wrapper">
          <OrdersChart filters={filters} />
        </div>

        <div className="orders-kpi-wrapper">
          <KpiGrid filters={filters} />
        </div>
      </div>

      {/* Produkt-Ranking darunter */}
      <div className="orders-ranking-wrapper">
        <ProductRanking
          start={filters.start.toString().slice(0, 10).trim()}
          end={filters.end.toString().slice(0, 10).trim()}
        />
      </div>
    </div>
  );
};

export default OrdersPage;

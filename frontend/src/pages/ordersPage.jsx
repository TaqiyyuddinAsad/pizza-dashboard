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
import OrderPie from "../components/OrderPie"
import  fetchOrderTimes  from "../services/OrderTimeService";
import { Card, CardContent, Typography } from "@mui/material";



const OrdersPage = () => {
  const [filters, setFilters] = useState({
    start: parseDate("2020-06-01"),
    end: parseDate("2020-07-01"),
    stores: [],
    categories: [],
    sizes: [],
  });

  
  const [orderTimes, setOrderTimes] = useState([]);

  const [productRanking, setProductRanking] = useState([]);
  const [storeRanking, setStoreRanking] = useState([]);

  // --- Fetch Rankings bei Filter-Änderung ---
  useEffect(() => {
    const start = filters.start.toString();
    const end = filters.end.toString();

    fetchProductRanking(start, end).then(setProductRanking);

    fetchStoreRanking(start, end).then(setStoreRanking);
  }, [filters]);

  useEffect(() => {
  // Hier brauchst du KEINEN neuen URLSearchParams – du hast die params schon im Objekt!
  // Du kannst filters direkt als params übergeben, wenn sie Strings sind!
  const params = {
    start: filters.start.toString(),
    end: filters.end.toString(),
    stores: filters.stores.join(","),
    categories: filters.categories.join(","),
    sizes: filters.sizes.join(","),
  };

  fetchOrderTimes(params)
    .then(setOrderTimes)
    .catch(err => console.error("Piechart-Daten laden fehlgeschlagen:", err));
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
  <div className="dashboard-row" style={{
  display: "flex",
  border: "2px solid red",
  gap: "32px",
  width: "100%",
  height: "100%",
  
  marginTop: "32px",
  
}}>
  {}
    <div style={{
    display: "flex",
    flexDirection: "row",
    gap: "32px",
    width: "100%",
    alignItems: "stretch",
    
     
  }}>
   <div style={{ flex: 1, minWidth: 0 }}>
    <ProductLeaderboard ranking={productRanking} />
  </div>
  <div style={{ flex: 1, minWidth: 0 }}>
    <StoreLeaderboard ranking={storeRanking} />
  </div>
  <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "stretch" }}>
    <Card style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <CardContent>
        <Typography variant="h6">Bestellzeitpunkte</Typography>
        <div
          style={{
            width: "100%",
            height: 250, 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <OrderPie data={orderTimes} />
        </div>
        {/* Filter info ... */}
      </CardContent>
    </Card>
  </div>
</div>

</div>
</div>
  );
  
};

export default OrdersPage;

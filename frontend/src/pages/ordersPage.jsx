import { useEffect, useState, useContext, useMemo } from "react";
import { fetchStoreRanking } from "../services/storeservice";
import { parseDate } from "@internationalized/date";
import OrdersChart from "../components/orderchart";
import KpiGridOrders from "../components/KpiGridOrders";
import ProductLeaderboard from "../components/ProductLeaderboard"; 
import StoreLeaderboard from "../components/StoreLeaderboard";
import "../styles/OrdersPage.css";
import OrderPie from "../components/OrderPie"
import  fetchOrderTimes  from "../services/OrderTimeService";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { FilterContext } from "../layout/layout";

const OrdersPage = () => {
  const { filters } = useContext(FilterContext);
  
  const [orderTimes, setOrderTimes] = useState([]);
  const [productRanking, setProductRanking] = useState([]);
  const [storeRanking, setStoreRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize chartFilters to prevent unnecessary re-renders
  const chartFilters = useMemo(() => ({
    start: filters.start ? parseDate(filters.start) : parseDate("2020-06-01"),
    end: filters.end ? parseDate(filters.end) : parseDate("2020-07-01"),
    stores: filters.stores || [],
    categories: filters.categories || [],
    sizes: filters.sizes || [],
  }), [filters.start, filters.end, filters.stores, filters.categories, filters.sizes]);
  
  // Load essential data first (Chart and KPIs)
  useEffect(() => {
    console.log('ordersPage filters:', filters);
    if (!filters.start || !filters.end) return;

    // Only show loading for non-essential data
    setLoading(true);
    setError(null);

    const params = {
      start: filters.start,
      end: filters.end,
      stores: filters.stores?.join(",") || "",
      categories: filters.categories?.join(",") || "",
      sizes: filters.sizes?.join(",") || "",
    };

    console.log('Calling getBestsellersByOrders with:', filters);
    // Load secondary data (rankings and order times) with delay
    setTimeout(() => {
      Promise.allSettled([
        fetch(`http://localhost:8080/api/products/ranking?start=${filters.start}&end=${filters.end}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
          .then(res => res.json()),
        fetchStoreRanking(filters.start, filters.end),
        fetchOrderTimes(params)
      ])
      .then((results) => {
        const [productResult, storeResult, orderTimesResult] = results;
        
        if (productResult.status === 'fulfilled') {
          setProductRanking(Array.isArray(productResult.value) ? productResult.value : []);
        } else {
          setProductRanking([]);
          console.error("Product ranking failed:", productResult.reason);
        }
        
        if (storeResult.status === 'fulfilled') {
          setStoreRanking(storeResult.value);
        } else {
          console.error("Store ranking failed:", storeResult.reason);
        }
        
        if (orderTimesResult.status === 'fulfilled') {
          setOrderTimes(orderTimesResult.value);
        } else {
          console.error("Order times failed:", orderTimesResult.reason);
          setError("Fehler beim Laden der Bestellzeiten");
        }
      })
      .catch((err) => {
        console.error("API calls failed:", err);
        setError("Fehler beim Laden der Daten");
      })
      .finally(() => {
        setLoading(false);
      });
    }, 100); // Small delay to let main content render first
  }, [filters]);

  return (
   <div className="orders-page dark:bg-gray-900">
  {/* OBERSTE REIHE: Chart und KPIs - Load immediately */}
  <div className="orders-container">
    <div className="orders-chart-wrapper">
      <OrdersChart filters={chartFilters} />
    </div>
    <div className="orders-kpi-wrapper">
      <KpiGridOrders filters={chartFilters} />
    </div>
  </div>
  
  {/* ZWEITE REIHE: 3er-Grid für Leaderboards & Pie - Load with delay */}
  <div className="dashboard-row" style={{
    display: "flex",
    minHeight: "600px",
    alignItems:"flex-start",
    width: "100%",
    marginTop: "32px",
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px' 
        }}>
          <CircularProgress size={40} />
        </div>
      ) : (
        <ProductLeaderboard ranking={productRanking} />
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px' 
        }}>
          <CircularProgress size={40} />
        </div>
      ) : (
        <StoreLeaderboard ranking={storeRanking} />
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0, display: "flex", height: "551px" }}>
      <Card className="dark:bg-gray-800 dark:border-gray-700" style={{ width: "100%", maxWidth: 420, minHeight: 420, margin: '0 auto', display: "flex", flexDirection: "column", alignItems: 'center', boxSizing: 'border-box' }}>
        <Typography variant="h6" className="dark:text-gray-100" style={{ margin: '24px 0 0 0', alignSelf: 'center', fontWeight: 600 }}>Bestellzeitpunkte</Typography>
        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, width: '100%' }}>
          {loading ? (
            <CircularProgress size={40} />
          ) : error ? (
            <div className="dark:text-red-400" style={{ color: '#d32f2f', textAlign: 'center' }}>
              <p>❌ {error}</p>
            </div>
          ) : (
            <OrderPie data={orderTimes} />
          )}
        </CardContent>
      </Card>
    </div>
  </div>
</div>
  );
  
};

export default OrdersPage;

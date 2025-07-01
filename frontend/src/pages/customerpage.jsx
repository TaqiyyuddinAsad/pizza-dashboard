import { useEffect, useState } from "react";
import KpiGrid from "../components/KpiGrid";
import TotalCustomersCard from "../components/TotalCustomersCard";
import AverageRevenueCard from "../components/AverageRevenueCard";
import InactiveCustomerTable from "../components/inactiveCustomerTable";
import RevenuePieChart from "../components/revenuePieChart";
import StoreCustomerMap from "../components/map.jsx";
import "../styles/OrdersPage.css";
import { Card, CardContent, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";

const ChartToggleCard = ({ filters }) => {
  const [customerData, setCustomerData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("customers");

  useEffect(() => {
    setLoading(true);
    const params = {
      start: filters.start?.toString(),
      end: filters.end?.toString(),
      stores: (filters.stores || []).join(","),
      categories: (filters.categories || []).join(","),
      sizes: (filters.sizes || []).join(","),
    };
    const queryString = new URLSearchParams(params).toString();
    Promise.all([
      fetch(`http://localhost:8080/api/analytics/customer-count?${queryString}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/analytics/revenue-per-customer?${queryString}`).then(res => res.json())
    ]).then(([customers, revenue]) => {
      setCustomerData(customers);
      setRevenueData(revenue);
      setLoading(false);
    });
  }, [filters]);

  const chartTitle = activeChart === "customers" ? "Kundenentwicklung" : "Ø Umsatz pro Kunde";

  let chartData, chartOptions;
  if (activeChart === "customers") {
    chartData = {
      labels: customerData.map(d => d.period),
      datasets: [
        {
          label: "Kunden",
          data: customerData.map(d => d.totalCustomers),
          borderWidth: 2,
          fill: false,
          backgroundColor: '#6366f1',
          borderColor: '#6366f1',
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } }
    };
  } else {
    chartData = {
      labels: revenueData.map(d => d.period),
      datasets: [
        {
          label: "Ø Umsatz pro Kunde",
          data: revenueData.map(d => d.avgRevenuePerCustomer),
          borderWidth: 2,
          fill: false,
          backgroundColor: '#10b981',
          borderColor: '#10b981',
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } }
    };
  }

  return (
    <Card style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      <CardContent style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16 }}>
        <Typography variant="h6" gutterBottom style={{ marginBottom: 16 }}>{chartTitle}</Typography>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
          <button
            className={`dashboard-dot ${activeChart === "customers" ? "active" : ""}`}
            onClick={() => setActiveChart("customers")}
            style={{ width: 12, height: 12, borderRadius: "50%", background: activeChart === "customers" ? "#8b5cf6" : "#e0e0e0", border: "none", cursor: "pointer", transition: "background 0.2s" }}
            aria-label="Kundenentwicklung anzeigen"
          />
          <button
            className={`dashboard-dot ${activeChart === "revenue" ? "active" : ""}`}
            onClick={() => setActiveChart("revenue")}
            style={{ width: 12, height: 12, borderRadius: "50%", background: activeChart === "revenue" ? "#8b5cf6" : "#e0e0e0", border: "none", cursor: "pointer", transition: "background 0.2s" }}
            aria-label="Ø Umsatz pro Kunde anzeigen"
          />
        </div>
        <div style={{ flex: 1, minHeight: 220, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <Line data={chartData} options={chartOptions} style={{ width: '100%', height: '100%' }} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CustomerPage = ({ filters }) => {
  return (
    <div className="orders-page">
      <div className="main-content-wrapper">
        {/* TOP ROW: Chart (left) and KPIs (right) */}
        <div className="orders-container">
          <div className="orders-chart-wrapper">
            <ChartToggleCard filters={filters} />
          </div>
          <div className="orders-kpi-wrapper">
            <KpiGrid filters={filters} />
          </div>
        </div>
        {/* MAP FULL WIDTH */}
        <div style={{ width: '100%', marginTop: 32 }}>
          <Card style={{ width: '100%', height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 32 }}>
            <CardContent style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom style={{ margin: 24 }}>Standorte & Kunden</Typography>
              <div style={{ width: '100%', height: 540, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <StoreCustomerMap height={540} />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* PIE + TABLE ROW */}
        <div className="dashboard-row" style={{ marginTop: 0 }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
            <Card style={{ width: '100%', height: 340, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent style={{ padding: 16 }}>
                <Typography variant="h6" gutterBottom style={{ marginBottom: 16 }}>Kundenumsatz-Verteilung</Typography>
                <div style={{ width: '100%', height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: 200, height: 200 }}>
                    <RevenuePieChart filters={filters} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div style={{ flex: 1, minWidth: 0, marginLeft: 16 }}>
            <Card style={{ width: '100%', height: 340, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <CardContent style={{ padding: 16 }}>
                <Typography variant="h6" gutterBottom>Inaktive Kunden</Typography>
                <div style={{ width: '100%', height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <InactiveCustomerTable filters={filters} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;

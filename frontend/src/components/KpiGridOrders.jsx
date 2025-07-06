import React, { useEffect, useState, memo } from "react";
import { KpiCard } from "./KpiCard";
import { fetchKpiData } from "../services/kpiservice";
import { FaEuroSign, FaShoppingCart, FaTag } from "react-icons/fa";

const KpiGridOrders = memo(({ filters }) => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filters?.start || !filters?.end) return;

    // Check if token exists before making request
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token available for KPI request');
      setError('No authentication token available');
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("start", filters.start.toString());
    params.append("end", filters.end.toString());
    if (filters.stores?.length) params.append("stores", filters.stores.join(","));
    if (filters.categories?.length) params.append("categories", filters.categories.join(","));
    if (filters.sizes?.length) params.append("sizes", filters.sizes.join(","));

    console.log('🚀 Making KPI request with token:', token.substring(0, 20) + '...');

    fetchKpiData(params.toString())
      .then(setKpis)
      .catch((err) => {
        console.error("KPI loading failed:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 gap-6 w-full">
        <div className="col-span-2 text-center text-red-600 p-6">
          Fehler beim Laden der KPIs: {error}
        </div>
      </div>
    );
  }

  if (!kpis) return null;

  const cardProps = [
    {
      title: "Gesamtumsatz",
      price: kpis["Revenue"] != null ? `${kpis["Revenue"].toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€` : "-",
      percentage: "",
      icon: <FaEuroSign style={{ color: "#a78bfa", fontSize: 22 }} />, // lila
      bgColor: "bg-violet-200",
      accentColor: "#a78bfa",
      subtitle: "Gesamter Umsatz im Zeitraum"
    },
    {
      title: "Ø Bestellwert",
      price: kpis["Avg Order Value"] != null ? `${kpis["Avg Order Value"].toFixed(2)}€` : "-",
      percentage: "",
      icon: <FaEuroSign style={{ color: "#22c55e", fontSize: 22 }} />, // grün
      bgColor: "bg-green-300",
      accentColor: "#22c55e",
      subtitle: "Durchschnittlicher Bestellwert"
    },
    {
      title: "Bestellungen",
      price: kpis["Total Orders"] != null ? kpis["Total Orders"].toLocaleString("de-DE") : "-",
      percentage: "",
      icon: <FaShoppingCart style={{ color: "#60a5fa", fontSize: 22 }} />, // blau
      bgColor: "bg-blue-200",
      accentColor: "#60a5fa",
      subtitle: "Anzahl Bestellungen"
    },
    {
      title: "Artikel",
      price: kpis["Total Items"] != null ? kpis["Total Items"].toLocaleString("de-DE") : "-",
      percentage: "",
      icon: <FaTag style={{ color: "#f59e42", fontSize: 22 }} />, // orange
      bgColor: "bg-orange-200",
      accentColor: "#f59e42",
      subtitle: "Anzahl verkaufter Artikel"
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 w-full">
      {cardProps.map((kpi, i) => (
        <KpiCard key={i} {...kpi} />
      ))}
    </div>
  );
});

KpiGridOrders.displayName = 'KpiGridOrders';

export default KpiGridOrders; 
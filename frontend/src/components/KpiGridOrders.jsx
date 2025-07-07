import React, { memo } from "react";
import { KpiCard } from "./KpiCard";
import { fetchKpiData } from "../services/kpiservice";
import { FaDollarSign, FaShoppingCart, FaTag } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';

const KpiGridOrders = memo(({ filters }) => {
  const { data: kpis, isLoading, error } = useQuery({
    queryKey: ['order-kpis', filters],
    queryFn: () => fetchKpiData(new URLSearchParams({
      start: filters.start.toString(),
      end: filters.end.toString(),
      ...(filters.stores?.length && { stores: filters.stores.join(",") }),
      ...(filters.categories?.length && { categories: filters.categories.join(",") }),
      ...(filters.sizes?.length && { sizes: filters.sizes.join(",") }),
    }).toString()),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
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
          Fehler beim Laden der KPIs: {error.message}
        </div>
      </div>
    );
  }

  if (!kpis) return null;

  const cardProps = [
    {
      title: "Gesamtumsatz",
      price: kpis["Revenue"] != null ? `${kpis["Revenue"].toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$` : "-",
      percentage: "",
      icon: <FaDollarSign style={{ color: "#a78bfa", fontSize: 22 }} />, // lila
      bgColor: "bg-violet-200",
      accentColor: "#a78bfa"
    },
    {
      title: "Ø Bestellwert",
      price: kpis["Avg Order Value"] != null ? `${kpis["Avg Order Value"].toFixed(2)}$` : "-",
      percentage: "",
      icon: <FaDollarSign style={{ color: "#22c55e", fontSize: 22 }} />, // grün
      bgColor: "bg-green-300",
      accentColor: "#22c55e"
    },
    {
      title: "Bestellungen",
      price: kpis["Total Orders"] != null ? kpis["Total Orders"].toLocaleString("de-DE") : "-",
      percentage: "",
      icon: <FaShoppingCart style={{ color: "#60a5fa", fontSize: 22 }} />, // blau
      bgColor: "bg-blue-200",
      accentColor: "#60a5fa"
    },
    {
      title: "Artikel",
      price: kpis["Total Items"] != null ? kpis["Total Items"].toLocaleString("de-DE") : "-",
      percentage: "",
      icon: <FaTag style={{ color: "#f59e42", fontSize: 22 }} />, // orange
      bgColor: "bg-orange-200",
      accentColor: "#f59e42"
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
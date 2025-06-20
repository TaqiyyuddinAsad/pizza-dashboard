import React, { useEffect, useState } from "react";
import { KpiCard } from "./KpiCard";
import { fetchKpiData } from "../services/kpiservice";
import { FaEuroSign, FaShoppingCart, FaTag } from "react-icons/fa";

export default function KpiGridOrders({ filters }) {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("start", filters.start.toString());
    params.append("end", filters.end.toString());
    if (filters.stores.length) params.append("stores", filters.stores.join(","));
    if (filters.categories.length) params.append("categories", filters.categories.join(","));
    if (filters.sizes.length) params.append("sizes", filters.sizes.join(","));

    fetchKpiData(params.toString())
      .then((res) => res.json())
      .then(setKpis)
      .catch(console.error);
  }, [filters]);

  if (!kpis) return <div>Loading KPIs...</div>;

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
} 
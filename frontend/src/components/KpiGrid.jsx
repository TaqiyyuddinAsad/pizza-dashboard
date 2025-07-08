import React, { useEffect, useState } from "react";
import { KpiCard } from "./KpiCard";
import { fetchKpiData } from "../services/kpiservice";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FaRedo, FaClock, FaMapMarkerAlt, FaDollarSign, FaShoppingCart, FaTag } from "react-icons/fa";

function KpiGrid({ filters }) {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("start", filters.start.toString());
    params.append("end", filters.end.toString());
    if (filters.stores.length) params.append("stores", filters.stores.join(","));
    if (filters.categories.length) params.append("categories", filters.categories.join(","));
    if (filters.sizes.length) params.append("sizes", filters.sizes.join(","));
    console.log("⏱ Fetching KPIs with params:", params.toString());

    fetchKpiData(params.toString())
      .then(setKpis)
      .catch((err) => {
        setKpis(null);
        console.error(err);
      });
  }, [filters]);

  if (kpis === null) return <div style={{color: 'red'}}>KPIs werden geladen.</div>;

  const cardProps = [
    {
      title: "Ø Tage bis 2. Bestellung",
      price: kpis["AvgDaysBetweenOrders"] != null ? `${kpis["AvgDaysBetweenOrders"].toFixed(1)} Tage` : "-",
      percentage: "",
      icon: <FaClock style={{ color: "#a78bfa", fontSize: 22 }} />, // lila
      bgColor: "bg-violet-200",
      accentColor: "#a78bfa",
      subtitle: "zwischen 1. und 2. Bestellung"
    },
    {
      title: "Ø Lieferentfernung",
      price: kpis["AvgDeliveryDistance"] != null ? `${kpis["AvgDeliveryDistance"].toFixed(1)} km` : "-",
      percentage: "",
      icon: <FaMapMarkerAlt style={{ color: "#a3a3a3", fontSize: 22 }} />, // grau
      bgColor: "bg-gray-200",
      accentColor: "#a3a3a3",
      subtitle: "Ø Lieferentfernung"
    },
    {
      title: "Durchschnittliche Gesamtkunden",
      price: kpis["Durchschnittliche Gesamtkunden"] != null ? kpis["Durchschnittliche Gesamtkunden"].toLocaleString() : "-",
      percentage: "",
      icon: <FaShoppingCart style={{ color: "#6366f1", fontSize: 22 }} />, // blau-lila
      bgColor: "bg-indigo-200",
      accentColor: "#6366f1",
      subtitle: "Ø distinct Kunden pro Periode"
    },
    {
      title: "Wiederkehrerquote",
      price: kpis["RepeatRate"] != null ? `${kpis["RepeatRate"].toFixed(0)} %` : "-",
      percentage: "",
      icon: <FaRedo style={{ color: "#fde047", fontSize: 22 }} />, // gelb
      bgColor: "bg-yellow-200",
      accentColor: "#fde047",
      subtitle: "Wiederkehrerquote"
    },
  ];

  return (
    <div className="grid grid-cols-2" style={{ gap: 32, width: '100%' }}>
      {cardProps.map((kpi, i) => (
        <KpiCard key={i} {...kpi} titleStyle={{ fontSize: '1rem', fontWeight: 500 }} valueStyle={{ fontSize: '1.5rem', fontWeight: 600 }} />
      ))}
    </div>
  );
}

export default React.memo(KpiGrid);

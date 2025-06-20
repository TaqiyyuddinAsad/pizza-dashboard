import React, { useEffect, useState } from "react";
import { KpiCard } from "./KpiCard";
import { fetchKpiData } from "../services/kpiservice";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FaRedo, FaClock, FaMapMarkerAlt, FaEuroSign, FaShoppingCart, FaTag } from "react-icons/fa";

export default function KpiGrid({ filters }) {
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
      .then((res) => res.json())
      .then(setKpis)
      .catch(console.error);
  }, [filters]);

  if (!kpis) return <div>Loading KPIs...</div>;

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
      title: "Ø Bestellwert",
      price: kpis["Avg Order Value"] != null ? `${kpis["Avg Order Value"].toFixed(2)}€` : "-",
      percentage: "",
      icon: <FaEuroSign style={{ color: "#22c55e", fontSize: 22 }} />, // grün
      bgColor: "bg-green-300",
      accentColor: "#22c55e",
      subtitle: "Ø Bestellwert"
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
    <div className="grid grid-cols-2 gap-6 w-full">
      {cardProps.map((kpi, i) => (
        <KpiCard key={i} {...kpi} />
      ))}
    </div>
  );
}

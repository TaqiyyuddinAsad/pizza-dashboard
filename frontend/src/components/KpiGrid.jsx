import React, { useEffect, useState } from "react";
import { KpiCard } from "./KpiCard";
import { fetchKpiData } from "../services/kpiservice";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

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
      title: "Revenue",
      price: kpis["Revenue"] != null ? `$${kpis["Revenue"].toFixed(2)}` : "$0.00",
      percentage: "+12%",
      color: "green",
      icon: <ChevronUpIcon className="w-3 h-3 text-green-500" strokeWidth={4} />,
    },
    {
      title: "Avg Order Value",
      price: kpis["Avg Order Value"] != null ? `$${kpis["Avg Order Value"].toFixed(2)}` : "$0.00",
      percentage: "+4%",
      color: "green",
      icon: <ChevronUpIcon className="w-3 h-3 text-green-500" strokeWidth={4} />,
    },
    {
      title: "Total Orders",
      price: kpis["Total Orders"] != null ? kpis["Total Orders"].toLocaleString() : "0",
      percentage: "-3%",
      color: "red",
      icon: <ChevronDownIcon className="w-3 h-3 text-red-500" strokeWidth={4} />,
    },
    {
      title: "Total Items",
      price: kpis["Total Items"] != null ? kpis["Total Items"].toLocaleString() : "0",
      percentage: "+1%",
      color: "green",
      icon: <ChevronUpIcon className="w-3 h-3 text-green-500" strokeWidth={4} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {cardProps.map((kpi, i) => (
        <KpiCard key={i} {...kpi} />
      ))}
    </div>
  );
}

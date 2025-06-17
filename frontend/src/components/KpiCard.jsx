import React from "react";
import "../styles/KpiCard.css";

export function KpiCard({ title, percentage, price, color, icon }) {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <div className="kpi-percentage">
          {icon}
          <span className={`kpi-change ${color}`}>{percentage}</span>
        </div>
      </div>
      <div className="kpi-price">{price}</div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import MultiSelectFilter from "./multiselect";
import DateFilter from "./DateFilter"; // Optional – falls du den nutzt

const FilterBar = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    start: null,
    end: null,
    stores: [],
    categories: [],
    sizes: [],
  });

  const [options, setOptions] = useState({
    stores: [],
    categories: [],
    sizes: [],
  });

  // 🔄 Lade Optionen aus dem Backend
  useEffect(() => {
    fetch("http://localhost:8080/filters")
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error("Failed to load filter options:", err));
  }, []);

  // 📅 Date-Handler
  const handleDateChange = (start, end) => {
    setFilters((prev) => ({ ...prev, start, end }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="filter-bar" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {/* Optional: Datumsauswahl */}
      <DateFilter onDateChange={handleDateChange} />

      <MultiSelectFilter
        label="Kategorie"
        options={options.categories}
        selectedValues={filters.categories}
        onChange={(newValues) => setFilters((prev) => ({ ...prev, categories: newValues }))}
      />

      <MultiSelectFilter
        label="Größe"
        options={options.sizes}
        selectedValues={filters.sizes}
        onChange={(newValues) => setFilters((prev) => ({ ...prev, sizes: newValues }))}
      />

      <MultiSelectFilter
        label="Filiale"
        options={options.stores}
        selectedValues={filters.stores}
        onChange={(newValues) => setFilters((prev) => ({ ...prev, stores: newValues }))}
      />

      <button onClick={handleApply}>Apply</button>
    </div>
  );
};

export default FilterBar;

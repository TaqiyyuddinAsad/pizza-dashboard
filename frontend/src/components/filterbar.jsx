import React, { useEffect, useState, memo, useMemo } from "react";
import MultiSelectFilter from "./multiselect";
import DateFilter from "./DateFilter"; // Optional – falls du den nutzt

const today = new Date().toISOString().slice(0, 10);
const thirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const FilterBar = memo(({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    start: thirtyDaysAgo,
    end: today,
    stores: [],
    categories: [],
    sizes: [],
  });

  const [options, setOptions] = useState({
    stores: [],
    categories: [],
    sizes: [],
  });

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    fetch("http://localhost:8080/filters")
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch((err) => console.error("Failed to load filter options:", err));
  }, []);

  const handleDateChange = (start, end) => {
    setFilters((prev) => ({
      ...prev,
      start: start || thirtyDaysAgo,
      end: end || today,
    }));
  };

  const handleApply = () => {
    // Always send valid dates
    const safeFilters = {
      ...filters,
      start: filters.start || thirtyDaysAgo,
      end: filters.end || today,
    };
    console.log("🔍 Filter angewendet:", safeFilters);
    onApplyFilters(safeFilters);
  };

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-lg shadow-gray-300/40 mt-2">
      <DateFilter onDateChange={handleDateChange} />

      <MultiSelectFilter
        label="Kategorie"
        options={memoizedOptions.categories}
        selectedValues={filters.categories}
        onChange={(newValues) =>
          setFilters((prev) => ({ ...prev, categories: newValues }))
        }
      />

      <MultiSelectFilter
        label="Größe"
        options={memoizedOptions.sizes}
        selectedValues={filters.sizes}
        onChange={(newValues) =>
          setFilters((prev) => ({ ...prev, sizes: newValues }))
        }
      />

      <MultiSelectFilter
        label="Filiale"
        options={memoizedOptions.stores}
        selectedValues={filters.stores}
        onChange={(newValues) =>
          setFilters((prev) => ({ ...prev, stores: newValues }))
        }
      />

      <button
        onClick={handleApply}
        className="ml-auto px-6 py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
      >
        Anfrage schicken
      </button>
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;

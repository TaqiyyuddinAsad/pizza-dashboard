import React, { useEffect, useState, memo, useMemo } from "react";
import MultiSelectFilter from "./multiselect";
import DateFilter from "./DateFilter"; // Optional – falls du den nutzt
import { API_BASE_URL } from '../config/api.js';

const today = new Date().toISOString().slice(0, 10);
const thirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const FilterBar = memo(({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    start: '2020-01-01',
    end: '2020-02-01',
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
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Fetch filter options from the /filters endpoint
    fetch(`${API_BASE_URL}/filters`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch filters');
        return res.json();
      })
      .then((data) => { 
        if (data) {
          setOptions({
            categories: data.categories || [],
            sizes: data.sizes || [],
            stores: data.stores || []
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load filter options:", err);
        if (err.message.includes('401')) {
          window.location.href = '/login';
        }
      });
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

  const handleReset = () => {
    setFilters({
      start: '2020-01-01',
      end: '2020-02-01',
      stores: [],
      categories: [],
      sizes: [],
    });
    // Do NOT call onApplyFilters here
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-lg shadow-gray-300/40 dark:shadow-gray-900/40 mt-2 border border-gray-200 dark:border-gray-700">
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
        <button
          onClick={handleReset}
          className="ml-2 px-6 py-2 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
        >
          Filter zurücksetzen
        </button>
      </div>
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;

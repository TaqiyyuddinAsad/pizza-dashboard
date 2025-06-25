import React, { useState, useEffect } from "react";
// import FilterBar from "../components/filterbar"; // Removed, now global
import ProductBestsellerList from "../components/ProductBestsellerList";
import ProductCombinationsList from "../components/ProductCombinationsList";
import ProductPerformanceChart from "../components/productPerformanceChart";
import CategorySalesBarChart from "../components/CategorySalesBarChart";
import ProductSizePieChart from "../components/ProductSizePieChart";
import ProductBestsellersTable from "../components/ProductBestsellersTable";
import { getBestsellersByOrders, getWorstSellersByOrders, getBestsellersByRevenue, getWorstSellersByRevenue, getProductCombinations, getCategories, getAllProducts, getProductPerformanceAfterLaunch } from "../services/productservice";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useContext } from 'react';
import { FilterContext } from '../layout/layout';

const defaultStart = "2021-01-01";
const defaultEnd = "2021-12-31";

const ProductsPage = () => {
  const { filters } = useContext(FilterContext);
  // Pagination state
  const [bestsellerPage, setBestsellerPage] = useState(0);
  const [bestsellerRowsPerPage, setBestsellerRowsPerPage] = useState(5);
  const [bestsellerTotal, setBestsellerTotal] = useState(0);
  const [combPage, setCombPage] = useState(0);
  const [combRowsPerPage, setCombRowsPerPage] = useState(5);
  const [combTotal, setCombTotal] = useState(0);

  const [bestsellers, setBestsellers] = useState([]);
  const [combinations, setCombinations] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [pieBySize, setPieBySize] = useState([]);
  const [showPerformance, setShowPerformance] = useState(true);
  const [sortBy, setSortBy] = useState('orders'); // 'orders' or 'revenue'
  const [sortOrder, setSortOrder] = useState('best'); // 'best' or 'worst'
  const [daysAfterLaunch, setDaysAfterLaunch] = useState(30); // default 30 days
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productList, setProductList] = useState([]);
  const [pendingProduct, setPendingProduct] = useState("");
  const [pendingDays, setPendingDays] = useState(30);
  const [applyTrigger, setApplyTrigger] = useState(0);
  const [pendingSize, setPendingSize] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch data on filter or pagination change
  useEffect(() => {
    if (!filters.start || !filters.end) return;
    
    // Only use one store if selected, otherwise fetch for all
    const storeFilter = (filters.stores && filters.stores.length === 1) ? [filters.stores[0]] : [];
    // Convert filters to the format expected by the service
    const serviceFilters = {
      startDate: filters.start,
      endDate: filters.end,
      store: storeFilter,
      category: filters.categories,
      size: filters.sizes
    };

    let fetchFn;
    if (sortBy === 'orders') {
      fetchFn = sortOrder === 'best' ? getBestsellersByOrders : getWorstSellersByOrders;
    } else {
      fetchFn = sortOrder === 'best' ? getBestsellersByRevenue : getWorstSellersByRevenue;
    }

    fetchFn(serviceFilters, bestsellerPage, bestsellerRowsPerPage)
      .then(res => {
        setBestsellers(
          Array.isArray(res.data)
            ? res.data.map(row => ({
                name: row.productName,
                price: row.productPrice,
                size: row.productSize,
                orders: row.totalOrders,
                revenue: row.totalRevenue,
                category: row.productCategory,
                store: row.storeId,
                storeCity: row.storeCity,
                storeState: row.storeState
              }))
            : []
        );
        setBestsellerTotal(res.total || 0);
      })
      .catch(() => {
        setBestsellers([]);
        setBestsellerTotal(0);
      });

    // Fetch combinations data
    getProductCombinations(serviceFilters, combPage, combRowsPerPage)
      .then(res => {
        setCombinations(Array.isArray(res.data) ? res.data : []);
        setCombTotal(res.total || 0);
      })
      .catch(() => {
        setCombinations([]);
        setCombTotal(0);
      });
      
    // Note: These functions may need to be implemented in the service
    // For now, we'll set empty arrays
    setCategorySales([]);
    setPieBySize([]);
    
    // For performance, you may want to pass a specific SKU
    // getProductPerformance({ ...serviceFilters, sku: "SKU123" }).then(res => setPerformance(res.data));
  }, [filters, bestsellerPage, bestsellerRowsPerPage, sortBy, sortOrder, combPage, combRowsPerPage]);

  // Fetch product list for selector
  useEffect(() => {
    getAllProducts()
      .then(products => {
        setProductList(products);
        if (!pendingProduct && products.length > 0) setPendingProduct(products[0].sku);
        if (!pendingSize && products.length > 0 && products[0].sizes && products[0].sizes.length > 0) setPendingSize(products[0].sizes[0]);
      })
      .catch(() => setProductList([]));
  }, [filters]);

  // When apply is clicked, update selectedProduct, daysAfterLaunch, and selectedSize
  const handleApply = () => {
    setSelectedProduct(pendingProduct);
    setDaysAfterLaunch(pendingDays);
    setSelectedSize(pendingSize);
    setApplyTrigger(t => t + 1);
  };

  // Fetch performance data for selected product, size, days after launch
  useEffect(() => {
    if (showPerformance && selectedProduct && filters && filters.start && filters.end) {
      const storeId = (filters.stores && filters.stores.length === 1) ? filters.stores[0] : undefined;
      getProductPerformanceAfterLaunch(selectedProduct, daysAfterLaunch, selectedSize, storeId)
        .then(res => setPerformance(res || []))
        .catch(() => setPerformance([]));
    }
  }, [showPerformance, selectedProduct, daysAfterLaunch, selectedSize, filters, applyTrigger]);

  // Fetch category sales by revenue
  useEffect(() => {
    if (!showPerformance && filters && filters.start && filters.end) {
      getBestsellersByRevenue({ ...filters }, 0, 1000)
        .then(res => {
          // Aggregate revenue by category
          const byCategory = {};
          (res.data || []).forEach(row => {
            if (!byCategory[row.productCategory]) byCategory[row.productCategory] = 0;
            byCategory[row.productCategory] += row.totalRevenue;
          });
          setCategorySales(Object.entries(byCategory).map(([category, revenue]) => ({ category, revenue })));
        })
        .catch(() => setCategorySales([]));
    }
  }, [showPerformance, filters]);

  // Helper for summary bar
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE');
  };
  const getTableTypeLabel = () => {
    if (sortOrder === 'best') return sortBy === 'orders' ? 'Bestsellers' : 'Top Revenue';
    return sortBy === 'orders' ? 'Worst Sellers' : 'Lowest Revenue';
  };
  const getDateRangeLabel = () => `${formatDate(filters.start)} - ${formatDate(filters.end)}`;
  const getStoreLabel = () =>
    (filters.stores && filters.stores.length === 1 && filters.stores[0])
      ? `Store: ${filters.stores[0]}`
      : 'All Stores';
  const getCategoryLabel = () =>
    (filters.categories && filters.categories.length === 1 && filters.categories[0])
      ? `| Category: ${filters.categories[0]}`
      : '';
  const getSizeLabel = () =>
    (filters.sizes && filters.sizes.length === 1 && filters.sizes[0])
      ? `| Size: ${filters.sizes[0]}`
      : '';

  // Convert filters to the format expected by ProductBestsellersTable
  const tableFilters = {
    startDate: filters.start,
    endDate: filters.end,
    store: filters.stores,
    size: filters.sizes,
    category: filters.categories
  };

  return (
    <div className="product-analysis-page">
      {/* Material UI toggles for both tables */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={sortBy}
          exclusive
          onChange={(_e, val) => val && setSortBy(val)}
          size="small"
        >
          <ToggleButton value="orders">By Orders</ToggleButton>
          <ToggleButton value="revenue">By Revenue</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={sortOrder}
          exclusive
          onChange={(_e, val) => val && setSortOrder(val)}
          size="small"
        >
          <ToggleButton value="best">Best</ToggleButton>
          <ToggleButton value="worst">Worst</ToggleButton>
        </ToggleButtonGroup>
        </div>
      {/* Applied filters summary bar */}
      <div style={{ marginBottom: '1rem', fontWeight: 500, fontSize: '1.1rem' }}>
        {getTableTypeLabel()} | {getDateRangeLabel()} | {getStoreLabel()} {getCategoryLabel()} {getSizeLabel()}
        </div>
      {/* FilterBar removed from here, should be global */}
      
      <div className="top-section" style={{ display: "flex", gap: "2rem" }}>
        <ProductBestsellerList
          data={bestsellers || []}
          total={bestsellerTotal}
          page={bestsellerPage}
          rowsPerPage={bestsellerRowsPerPage}
          onPageChange={setBestsellerPage}
          onRowsPerPageChange={setBestsellerRowsPerPage}
          filters={filters}
          dateRange={getDateRangeLabel()}
          storeLabel={getStoreLabel()}
        />
        <ProductCombinationsList
          data={combinations || []}
          total={combTotal}
          page={combPage}
          rowsPerPage={combRowsPerPage}
          onPageChange={setCombPage}
          onRowsPerPageChange={setCombRowsPerPage}
          filters={filters}
          dateRange={getDateRangeLabel()}
          storeLabel={getStoreLabel()}
        />
      </div>
      <div className="bottom-section" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <ToggleButtonGroup
            value={showPerformance ? 'performance' : 'category'}
            exclusive
            onChange={(_e, val) => val && setShowPerformance(val === 'performance')}
            size="small"
          >
            <ToggleButton value="performance">Performance nach Launch</ToggleButton>
            <ToggleButton value="category">Sales by Category</ToggleButton>
          </ToggleButtonGroup>
          {showPerformance && (
            <>
              <span>Produkt:</span>
              <select
                value={pendingProduct}
                onChange={e => {
                  setPendingProduct(e.target.value);
                  const prod = productList.find(p => p.sku === e.target.value);
                  if (prod && prod.sizes && prod.sizes.length > 0) setPendingSize(prod.sizes[0]);
                }}
                style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 180 }}
              >
                {productList.map(p => (
                  <option key={p.sku} value={p.sku}>
                    {p.name}{p.sizes ? ` (${p.sizes.join(', ')})` : ''}
                  </option>
                ))}
              </select>
              <span>Größe:</span>
              <select
                value={pendingSize}
                onChange={e => setPendingSize(e.target.value)}
                style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 80 }}
              >
                {(productList.find(p => p.sku === pendingProduct)?.sizes || []).map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span>Tage nach Launch:</span>
              <select value={pendingDays} onChange={e => setPendingDays(Number(e.target.value))} style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 80 }}>
                {[7, 14, 30, 60, 90, 180, 365].map(days => (
                  <option key={days} value={days}>{days}</option>
                ))}
              </select>
              <button onClick={handleApply} style={{ marginLeft: 8, padding: '4px 12px', borderRadius: 4, border: '1px solid #1976d2', background: '#1976d2', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>Apply</button>
            </>
          )}
        </div>
        <div style={{ minHeight: 350 }}>
          {showPerformance ? (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>Performance nach Launch</span>
                <span style={{ fontSize: 18, fontWeight: 500, color: '#1976d2' }}>
                  Umsatz: {performance.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
              <ProductPerformanceChart data={performance || []} />
            </div>
          ) : (
            <CategorySalesBarChart data={categorySales || []} filters={filters} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

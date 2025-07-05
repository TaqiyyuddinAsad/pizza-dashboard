import React, { useState, useEffect } from "react";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
// import FilterBar from "../components/filterbar"; // Removed, now global
import ProductBestsellerList from "../components/ProductBestsellerList";
import ProductCombinationsList from "../components/ProductCombinationsList";
import ProductPerformanceChart from "../components/productPerformanceChart";
import CategorySalesBarChart from "../components/CategorySalesBarChart";
import ProductSizePieChart from "../components/ProductSizePieChart";
import ProductBestsellersTable from "../components/ProductBestsellersTable";
import { getBestsellersByOrders, getWorstSellersByOrders, getBestsellersByRevenue, getWorstSellersByRevenue, getProductCombinations, getCategories, getAllProducts, getProductPerformanceAfterLaunch, getCategorySalesTimeline, getSalesBySizePie } from "../services/productservice";
import { useContext } from 'react';
import { FilterContext } from '../layout/layout';
import CategoryRevenuePieChart from "../components/CategoryRevenuePieChart";

const defaultStart = "2020-01-01";
const defaultEnd = "2020-02-01";

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

  // Fetch product list for selector
  useEffect(() => {
    getAllProducts()
      .then(products => {
        setProductList(products);
        if (!pendingProduct && products.length > 0) {
          setPendingProduct(products[0].sku);
          setSelectedProduct(products[0].sku); // Set initial selected product
        }
        if (!pendingSize && products.length > 0 && products[0].sizes && products[0].sizes.length > 0) {
          setPendingSize(products[0].sizes[0]);
          setSelectedSize(products[0].sizes[0]); // Set initial selected size
        }
      })
      .catch(() => setProductList([]));
  }, []); // Only run once on mount

  // Ensure pendingProduct and pendingSize are valid for the current productList and filters
  useEffect(() => {
    if (productList.length > 0) {
      // If the current pendingProduct is not in the new productList, reset to first product
      const productSkus = productList.map(p => p.sku);
      if (!productSkus.includes(pendingProduct)) {
        setPendingProduct(productList[0].sku);
        setPendingSize(productList[0].sizes && productList[0].sizes.length > 0 ? productList[0].sizes[0] : '');
      } else {
        // If the current pendingSize is not available for the selected product, reset to first size
        const selectedProductObj = productList.find(p => p.sku === pendingProduct);
        if (selectedProductObj && selectedProductObj.sizes && !selectedProductObj.sizes.includes(pendingSize)) {
          setPendingSize(selectedProductObj.sizes[0]);
        }
      }
    }
    // Do NOT auto-apply!
    // Only update pending values if they are invalid for the new context
  }, [
    productList,
    filters.start,
    filters.end,
    filters.stores ? filters.stores.join(',') : '',
    filters.categories ? filters.categories.join(',') : '',
    filters.sizes ? filters.sizes.join(',') : ''
  ]);

  // Fetch data on filter or pagination change
  useEffect(() => {
    if (!filters.start || !filters.end) return;
    const storeFilter = (filters.stores && filters.stores.length === 1) ? [filters.stores[0]] : [];
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
    getProductCombinations(serviceFilters, combPage, combRowsPerPage)
      .then(res => {
        setCombinations(Array.isArray(res.data) ? res.data : []);
        setCombTotal(res.total || 0);
      })
      .catch(() => {
        setCombinations([]);
        setCombTotal(0);
      });
    setCategorySales([]);
    setPieBySize([]);
  }, [
    filters.start,
    filters.end,
    filters.stores ? filters.stores.join(',') : '',
    filters.categories ? filters.categories.join(',') : '',
    filters.sizes ? filters.sizes.join(',') : '',
    bestsellerPage,
    bestsellerRowsPerPage,
    sortBy,
    sortOrder,
    combPage,
    combRowsPerPage
  ]);

  // Fetch sales by size pie chart data when filters change
  useEffect(() => {
    const serviceFilters = {
      startDate: filters.start,
      endDate: filters.end,
      store: filters.stores,
    };
    getSalesBySizePie(serviceFilters)
      .then(res => setPieBySize(res || []))
      .catch(() => setPieBySize([]));
  }, [filters.start, filters.end, filters.stores ? filters.stores.join(',') : '']);

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
  }, [showPerformance, selectedProduct, daysAfterLaunch, selectedSize, filters.start, filters.end, filters.stores ? filters.stores.join(',') : '', filters.categories ? filters.categories.join(',') : '', filters.sizes ? filters.sizes.join(',') : '', applyTrigger]);

  // Fetch category sales by revenue
  useEffect(() => {
    if (!showPerformance && filters && filters.start && filters.end) {
      const storeFilter = (filters.stores && filters.stores.length === 1) ? [filters.stores[0]] : [];
      const serviceFilters = {
        startDate: filters.start,
        endDate: filters.end,
        store: storeFilter,
        category: filters.categories,
        size: filters.sizes
      };
      getBestsellersByRevenue(serviceFilters, 0, 1000)
        .then(res => {
          const byCategory = {};
          (res.data || []).forEach(row => {
            if (!byCategory[row.productCategory]) byCategory[row.productCategory] = 0;
            byCategory[row.productCategory] += row.totalRevenue;
          });
          setCategorySales(Object.entries(byCategory).map(([category, revenue]) => ({ category, revenue })));
        })
        .catch(() => setCategorySales([]));
    }
  }, [
    showPerformance,
    filters.start,
    filters.end,
    filters.stores ? filters.stores.join(',') : '',
    filters.categories ? filters.categories.join(',') : '',
    filters.sizes ? filters.sizes.join(',') : ''
  ]);

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

  const ChartSliderToggle = ({ value, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
      <span style={{ marginRight: 8, fontWeight: value ? 600 : 400, color: value ? '#1976d2' : '#888', fontSize: 15 }}>Performance</span>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 48, height: 24, borderRadius: 12, background: value ? '#1976d2' : '#ccc', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', margin: '0 8px', display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', left: value ? 24 : 4, top: 2, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
        }} />
      </div>
      <span style={{ marginLeft: 8, fontWeight: !value ? 600 : 400, color: !value ? '#1976d2' : '#888', fontSize: 15 }}>Kategorie</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 32px 0 32px', background: '#f7f8fa', minHeight: '100vh' }}>
      <div className="product-analysis-page">
        {/* Material UI toggles for both tables */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
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
        <div style={{ marginBottom: '1.5rem', fontWeight: 500, fontSize: '1.1rem', color: '#222', textAlign: 'center' }}>
          {getTableTypeLabel()} | {getDateRangeLabel()} | {getStoreLabel()} {getCategoryLabel()} {getSizeLabel()}
        </div>
        {/* Top section: tables */}
        <div className="top-section" style={{ display: "flex", gap: "2rem", marginBottom: '2rem', justifyContent: 'center', width: '100%' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
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
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ProductCombinationsList
              data={
                sortOrder === 'best'
                  ? combinations.slice().sort((a, b) => b.count - a.count)
                  : combinations.slice().sort((a, b) => a.count - b.count)
              }
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
        </div>
        {/* Bottom section: charts */}
        <div className="bottom-section" style={{ display: "flex", gap: "2rem", marginTop: "2rem", justifyContent: 'center', width: '100%' }}>
          {/* Left: Chart card with toggle above */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Toggle and filters above card */}
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#222', flexWrap: 'wrap' }}>
              <ChartSliderToggle value={showPerformance} onChange={setShowPerformance} />
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
                    style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 120 }}
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
                  <select
                    value={pendingDays}
                    onChange={e => setPendingDays(Number(e.target.value))}
                    style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 80 }}
                  >
                    {[7, 14, 30, 60, 90, 180, 365].map(days => (
                      <option key={days} value={days}>{days}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleApply}
                    style={{
                      marginLeft: 8,
                      padding: '4px 12px',
                      borderRadius: 4,
                      border: '1px solid #1976d2',
                      background: '#1976d2',
                      color: '#fff',
                      fontWeight: 500,
                      cursor: 'pointer',
                      zIndex: 1000,
                      position: 'relative',
                      pointerEvents: 'auto'
                    }}
                  >
                    Apply
                  </button>
                </>
              )}
            </div>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 24, minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
              {/* Chart title */}
              <div style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 12, textAlign: 'left' }}>
                {showPerformance ? 'Performance nach Launch' : 'Umsatz nach Kategorie'}
              </div>
              {showPerformance ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 400, color: '#555' }}>
                        {getStoreLabel()} {selectedSize ? `| Size: ${selectedSize}` : ''} {selectedProduct ? `| Produkt: ${(productList.find(p => p.sku === selectedProduct)?.name) || selectedProduct}` : ''} {daysAfterLaunch ? `| Tage: ${daysAfterLaunch}` : ''}
                      </span>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 500, color: '#1976d2' }}>
                      Umsatz: {performance.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <ProductPerformanceChart data={performance || []} />
                </div>
              ) : (
                <CategorySalesBarChart
                  fetchCategorySalesTimeline={getCategorySalesTimeline}
                  filters={{
                    startDate: filters.start,
                    endDate: filters.end,
                    store: filters.stores,
                    size: filters.sizes
                  }}
                  filterSummary={
                    `${getDateRangeLabel()} | ${getStoreLabel()} ${getSizeLabel()}`
                  }
                />
              )}
            </div>
          </div>
          {/* Right: Pie chart card with title above chart */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 24, minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#111', marginBottom: 12, textAlign: 'center' }}>Verkaufsanteile nach Pizzagröße</div>
              <ProductSizePieChart data={pieBySize || []} filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

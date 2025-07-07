import React, { useState, useEffect } from "react";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
// import FilterBar from "../components/filterbar"; // Removed, now global
import ProductBestsellerList from "../components/ProductBestsellerList";
import ProductCombinationsList from "../components/ProductCombinationsList";
import ProductPerformanceChart from "../components/productPerformanceChart";
import CategorySalesBarChart from "../components/CategorySalesBarChart";
import ProductSizePieChart from "../components/ProductSizePieChart";
import ProductBestsellersTable from "../components/ProductBestsellersTable";
import { getBestsellersByOrders, getBestsellersByRevenue, getProductCombinations, getCategories, getAllProducts, getProductPerformanceAfterLaunch, getCategorySalesTimeline, getSalesBySizePie } from "../services/productservice";
import { useContext } from 'react';
import { FilterContext } from '../layout/layout';
import CategoryRevenuePieChart from "../components/CategoryRevenuePieChart";
import ProductStoreLeaderboard from "../components/ProductStoreLeaderboard";

const defaultStart = "2020-01-01";
const defaultEnd = "2020-02-01";

const ProductsPage = () => {
  const { filters } = useContext(FilterContext);
  // Pagination state
  const [bestsellerPage, setBestsellerPage] = useState(0);
  const [bestsellerRowsPerPage, setBestsellerRowsPerPage] = useState(5);
  const [combPage, setCombPage] = useState(0);
  const [combRowsPerPage, setCombRowsPerPage] = useState(5);
  const [showPerformance, setShowPerformance] = useState(true);
  const [sortBy, setSortBy] = useState('orders'); // 'orders' or 'revenue'
  const [sortOrder, setSortOrder] = useState('best'); // 'best' or 'worst'
  const [daysAfterLaunch, setDaysAfterLaunch] = useState(30); // default 30 days
  const [selectedProduct, setSelectedProduct] = useState("");
  const [pendingProduct, setPendingProduct] = useState("");
  const [pendingDays, setPendingDays] = useState(30);
  const [applyTrigger, setApplyTrigger] = useState(0);
  const [pendingSize, setPendingSize] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch product list for selector (not paginated, can stay as useEffect)
  const [productList, setProductList] = useState([]);
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
  }, []);

  // Ensure pendingProduct and pendingSize are valid for the current productList and filters
  useEffect(() => {
    if (productList.length > 0) {
      const productSkus = productList.map(p => p.sku);
      if (!productSkus.includes(pendingProduct)) {
        setPendingProduct(productList[0].sku);
        setPendingSize(productList[0].sizes && productList[0].sizes.length > 0 ? productList[0].sizes[0] : '');
      } else {
        const selectedProductObj = productList.find(p => p.sku === pendingProduct);
        if (selectedProductObj && selectedProductObj.sizes && !selectedProductObj.sizes.includes(pendingSize)) {
          setPendingSize(selectedProductObj.sizes[0]);
        }
      }
    }
  }, [productList, filters.start, filters.end, filters.stores ? filters.stores.join(',') : '', filters.categories ? filters.categories.join(',') : '', filters.sizes ? filters.sizes.join(',') : '']);

  // Bestseller query (orders or revenue)
  const bestsellerQueryKey = [
    'bestsellers', sortBy, sortOrder, filters.start, filters.end, filters.stores, filters.categories, filters.sizes, bestsellerPage, bestsellerRowsPerPage
  ];
  const bestsellerQuery = useQuery({
    queryKey: bestsellerQueryKey,
    queryFn: async () => {
      const storeFilter = (filters.stores && filters.stores.length === 1) ? [filters.stores[0]] : [];
      const serviceFilters = {
        startDate: filters.start,
        endDate: filters.end,
        store: storeFilter,
        category: filters.categories,
        size: filters.sizes
      };
      let fetchFn = sortBy === 'orders' ? getBestsellersByOrders : getBestsellersByRevenue;
      const res = await fetchFn(serviceFilters, bestsellerPage, bestsellerRowsPerPage);
      let data = Array.isArray(res.data) ? res.data : [];
      if (sortOrder === 'worst') data = data.reverse();
      return {
        bestsellers: data.map(row => ({
          name: row.productName,
          price: row.productPrice,
          size: row.productSize,
          orders: row.totalOrders,
          revenue: row.totalRevenue,
          category: row.productCategory,
          store: row.storeId,
          storeCity: row.storeCity,
          storeState: row.storeState
        })),
        total: res.total || 0
      };
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // Product combinations query
  const combinationsQueryKey = [
    'combinations', filters.start, filters.end, filters.stores, filters.categories, filters.sizes, combPage, combRowsPerPage
  ];
  const combinationsQuery = useQuery({
    queryKey: combinationsQueryKey,
    queryFn: async () => {
      const serviceFilters = {
        startDate: filters.start,
        endDate: filters.end,
        store: filters.stores,
        category: filters.categories,
        size: filters.sizes
      };
      const res = await getProductCombinations(serviceFilters, combPage, combRowsPerPage);
      return {
        combinations: Array.isArray(res.data) ? res.data : [],
        total: res.total || 0
      };
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // Pie by size query
  const pieBySizeQueryKey = [
    'pieBySize', filters.start, filters.end, filters.stores
  ];
  const pieBySizeQuery = useQuery({
    queryKey: pieBySizeQueryKey,
    queryFn: async () => {
      const serviceFilters = {
        startDate: filters.start,
        endDate: filters.end,
        store: filters.stores,
      };
      return await getSalesBySizePie(serviceFilters);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Kombinierter Dependency-String für Chart-Query
  const performanceDeps = JSON.stringify({
    showPerformance,
    selectedProduct,
    daysAfterLaunch,
    selectedSize,
    filters: {
      start: filters.start,
      end: filters.end,
      stores: filters.stores,
      categories: filters.categories,
      sizes: filters.sizes
    },
    applyTrigger
  });

  const performanceQuery = useQuery({
    queryKey: ['performance', performanceDeps],
    queryFn: async () => {
      if (showPerformance && selectedProduct && filters && filters.start && filters.end) {
        return await getProductPerformanceAfterLaunch(selectedProduct, daysAfterLaunch, {
          startDate: filters.start,
          endDate: filters.end,
          stores: filters.stores,
          category: filters.categories,
          size: filters.sizes
        });
      }
      return [];
    },
    enabled: showPerformance && !!selectedProduct && !!filters.start && !!filters.end,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch category sales by revenue
  const categorySalesQueryKey = [
    'categorySales', showPerformance, filters.start, filters.end, filters.stores, filters.categories, filters.sizes
  ];
  const categorySalesQuery = useQuery({
    queryKey: categorySalesQueryKey,
    queryFn: async () => {
      if (!showPerformance && filters && filters.start && filters.end) {
        const storeFilter = (filters.stores && filters.stores.length === 1) ? [filters.stores[0]] : [];
        const serviceFilters = {
          startDate: filters.start,
          endDate: filters.end,
          store: storeFilter,
          category: filters.categories,
          size: filters.sizes
        };
        const res = await getBestsellersByRevenue(serviceFilters, 0, 1000);
        const byCategory = {};
        (res.data || []).forEach(row => {
          if (!byCategory[row.productCategory]) byCategory[row.productCategory] = 0;
          byCategory[row.productCategory] += row.totalRevenue;
        });
        return Object.entries(byCategory).map(([category, revenue]) => ({ category, revenue }));
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  const getTableTypeLabel = () => {
    return `${sortOrder === 'best' ? 'Top' : 'Bottom'} ${sortBy === 'orders' ? 'Orders' : 'Revenue'}`;
  };

  const getDateRangeLabel = () => `${formatDate(filters.start)} - ${formatDate(filters.end)}`;
  const getStoreLabel = () =>
    (filters.stores && filters.stores.length === 1 && filters.stores[0])
      ? `| Store: ${filters.stores[0]}`
      : '';
  const getCategoryLabel = () =>
    (filters.categories && filters.categories.length === 1 && filters.categories[0])
      ? `| Category: ${filters.categories[0]}`
      : '';
  const getSizeLabel = () =>
    (filters.sizes && filters.sizes.length === 1 && filters.sizes[0])
      ? `| Size: ${filters.sizes[0]}`
      : '';

  const tableFilters = {
    startDate: filters.start,
    endDate: filters.end,
    store: filters.stores,
    size: filters.sizes,
    category: filters.categories
  };

  const ChartSliderToggle = ({ value, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
      <span className="dark:text-gray-300" style={{ 
        marginRight: 8, 
        fontWeight: value ? 600 : 400, 
        color: value ? '#1976d2' : '#888', 
        fontSize: 15 
      }}>
        Performance
      </span>
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
      <span className="dark:text-gray-300" style={{ 
        marginLeft: 8, 
        fontWeight: !value ? 600 : 400, 
        color: !value ? '#1976d2' : '#888', 
        fontSize: 15 
      }}>
        Kategorie
      </span>
    </div>
  );

  return (
    <div className="main-content dark:bg-gray-900" style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 32px 0 32px', minHeight: '100vh' }}>
      <div className="product-analysis-page">
        {/* Material UI toggles for both tables */}
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700" style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginBottom: '1.5rem', 
          marginTop: '2rem',
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: 16,
          padding: '1rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
        }}>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(_e, val) => val && setSortBy(val)}
            size="small"
            className="dark:bg-gray-700"
          >
            <ToggleButton 
              value="orders"
              className="dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 dark:data-[state=selected]:bg-blue-600"
            >
              By Orders
            </ToggleButton>
            <ToggleButton 
              value="revenue"
              className="dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 dark:data-[state=selected]:bg-blue-600"
            >
              By Revenue
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={(_e, val) => val && setSortOrder(val)}
            size="small"
            className="dark:bg-gray-700"
          >
            <ToggleButton 
              value="best"
              className="dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 dark:data-[state=selected]:bg-blue-600"
            >
              Best
            </ToggleButton>
            <ToggleButton 
              value="worst"
              className="dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 dark:data-[state=selected]:bg-blue-600"
            >
              Worst
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {/* Top section: tables */}
        <div className="top-section" style={{ display: "flex", gap: "2rem", marginBottom: '2rem', justifyContent: 'center', width: '100%' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ProductBestsellerList
              data={bestsellerQuery.data?.bestsellers || []}
              total={bestsellerQuery.data?.total || 0}
              page={bestsellerPage}
              rowsPerPage={bestsellerRowsPerPage}
              onPageChange={setBestsellerPage}
              onRowsPerPageChange={setBestsellerRowsPerPage}
              filters={filters}
              appliedFilters={`${sortOrder === 'best' ? 'Best Sellers' : 'Worst Sellers'} | ${getDateRangeLabel()} |${getStoreLabel()}${getCategoryLabel()}${getSizeLabel()}`}
              sortOrder={sortOrder}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ProductCombinationsList
              data={
                sortOrder === 'best'
                  ? combinationsQuery.data?.combinations.slice().sort((a, b) => b.count - a.count)
                  : combinationsQuery.data?.combinations.slice().sort((a, b) => a.count - b.count)
              }
              total={combinationsQuery.data?.total || 0}
              page={combPage}
              rowsPerPage={combRowsPerPage}
              onPageChange={setCombPage}
              onRowsPerPageChange={setCombRowsPerPage}
              filters={filters}
              appliedFilters={`${sortOrder === 'best' ? 'Beliebteste Kombinationen' : 'Unbeliebteste Kombinationen'} | ${getDateRangeLabel()} |${getStoreLabel()}${getCategoryLabel()}${getSizeLabel()}`}
              sortOrder={sortOrder}
            />
          </div>
        </div>
        {/* Bottom section: charts */}
        <div className="bottom-section" style={{ display: "flex", gap: "2rem", marginTop: "2rem", justifyContent: 'center', width: '100%' }}>
          {/* Left: Chart card with toggle above */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Toggle and filters above card */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700" style={{ 
              marginBottom: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              color: '#222', 
              flexWrap: 'wrap',
              borderRadius: 12,
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <ChartSliderToggle value={showPerformance} onChange={setShowPerformance} />
              {showPerformance && (
                <>
                  <span className="text-black dark:text-gray-300">Produkt:</span>
                  <select
                    value={pendingProduct}
                    onChange={e => {
                      setPendingProduct(e.target.value);
                      const prod = productList.find(p => p.sku === e.target.value);
                      if (prod && prod.sizes && prod.sizes.length > 0) setPendingSize(prod.sizes[0]);
                    }}
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 120 }}
                  >
                    {productList.map(p => (
                      <option key={p.sku} value={p.sku}>
                        {p.name}{p.sizes ? ` (${p.sizes.join(', ')})` : ''}
                      </option>
                    ))}
                  </select>
                  <span className="text-black dark:text-gray-300">Größe:</span>
                  <select
                    value={pendingSize}
                    onChange={e => setPendingSize(e.target.value)}
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 80 }}
                  >
                    {(productList.find(p => p.sku === pendingProduct)?.sizes || []).map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-black dark:text-gray-300">Tage nach Launch:</span>
                  <select
                    value={pendingDays}
                    onChange={e => setPendingDays(Number(e.target.value))}
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', minWidth: 80 }}
                  >
                    {[7, 14, 30, 60, 90, 180, 365].map(days => (
                      <option key={days} value={days}>{days}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setSelectedProduct(pendingProduct);
                      setSelectedSize(pendingSize);
                      setDaysAfterLaunch(pendingDays);
                      setApplyTrigger(t => t + 1);
                    }}
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
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 24, minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
              {/* Chart title */}
              <div className="text-black dark:text-gray-100" style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, textAlign: 'left' }}>
                {showPerformance ? 'Performance nach Launch' : 'Umsatz nach Kategorie'}
              </div>
              {showPerformance ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <span className="text-black dark:text-white" style={{ fontSize: 15, fontWeight: 400, color: '#555' }}>
                        {getStoreLabel()} {selectedSize ? `| Size: ${selectedSize}` : ''} {selectedProduct ? `| Produkt: ${(productList.find(p => p.sku === selectedProduct)?.name) || selectedProduct}` : ''} {daysAfterLaunch ? `| Tage: ${daysAfterLaunch}` : ''}
                      </span>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 500, color: '#1976d2' }}>
                      Umsatz: {performanceQuery.data?.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </div>
                  <ProductPerformanceChart data={performanceQuery.data || []} />
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
            <ProductStoreLeaderboard products={productList} filters={filters} />
          </div>
          {/* Right: Pie chart card with title above chart */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: 24, minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div className="text-black dark:text-gray-100" style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>Verkaufsanteile nach Pizzagröße</div>
              <ProductSizePieChart data={pieBySizeQuery.data || []} filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

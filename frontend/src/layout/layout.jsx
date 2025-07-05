import React, { useState, createContext, memo, useMemo } from 'react';
import Sidebar from '../components/sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import FilterBar from '../components/filterbar.jsx';
import '../styles/Layout.css';

export const FilterContext = createContext();

const Layout = memo(({ children }) => {
  const [filters, setFilters] = useState({
    start: '2020-01-01',
    end: '2020-02-01',
    stores: [],
    categories: [],
    sizes: [],
  });

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ filters, setFilters }), [filters]);

  return (
    <FilterContext.Provider value={contextValue}>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Topbar />
          <div>
            <div className="filterbar-fixed">
              <FilterBar onApplyFilters={setFilters} />
            </div>
            <main className="main-content">
              {React.cloneElement(children, { filters })}
            </main>
          </div>
        </div>
      </div>
    </FilterContext.Provider>
  );
});

Layout.displayName = 'Layout';

export default Layout;

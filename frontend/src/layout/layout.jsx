import React, { useState, createContext, memo, useMemo, useEffect } from 'react';
import Sidebar from '../components/sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import FilterBar from '../components/filterbar.jsx';
import '../styles/Layout.css';

export const FilterContext = createContext();
export const DarkModeContext = createContext();

const Layout = memo(({ children }) => {
  const [filters, setFilters] = useState({
    start: '2020-01-01',
    end: '2020-02-01',
    stores: [],
    categories: [],
    sizes: [],
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Memoize context values to prevent unnecessary re-renders
  const filterContextValue = useMemo(() => ({ filters, setFilters }), [filters]);
  const darkModeContextValue = useMemo(() => ({ darkMode, toggleDarkMode }), [darkMode]);

  return (
    <FilterContext.Provider value={filterContextValue}>
      <DarkModeContext.Provider value={darkModeContextValue}>
        <div className="app-layout">
          <Sidebar />
          <div className="main-area">
            <Topbar username="Admin" />
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
      </DarkModeContext.Provider>
    </FilterContext.Provider>
  );
});

Layout.displayName = 'Layout';

export default Layout;

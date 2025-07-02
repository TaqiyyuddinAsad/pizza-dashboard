import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginpage.jsx';
import Layout from './layout/layout.jsx';
import RevenuePage from './pages/revenuepage.jsx';
import OrdersPage from './pages/ordersPage.jsx';
import CustomerPage from './pages/customerpage.jsx';
import ProductPage from './pages/productsPage.jsx';
import './index.css';
import { CursorifyProvider } from '@cursorify/react';
import PizzaCursor from './components/PizzaCursor';
import React, { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call a protected endpoint to check session
    fetch('/revenue?start=2022-01-01&end=2022-12-31', { credentials: 'include' })
      .then(res => {
        setAuth(res.ok);
        setLoading(false);
      })
      .catch(() => {
        setAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) return null; // or a loading spinner
  return auth ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <>
      <PizzaCursor />
      <CursorifyProvider cursor={<PizzaCursor />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/umsatz" element={
              <ProtectedRoute>
                <Layout>
                  <RevenuePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/bestellungen" element={
              <ProtectedRoute>
                <Layout>
                  <OrdersPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/kunden" element={
              <ProtectedRoute>
                <Layout>
                  <CustomerPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/waren" element={
              <ProtectedRoute>
                <Layout>
                  <ProductPage />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </CursorifyProvider>
    </>
  );
}

export default App;
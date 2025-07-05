import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginpage.jsx';
import Layout from './layout/layout.jsx';
import RevenuePage from './pages/revenuepage.jsx';
import OrdersPage from './pages/ordersPage.jsx';
import CustomerPage from './pages/customerpage.jsx';
import ProductPage from './pages/productsPage.jsx';
import './index.css';
import React, { useEffect, useState } from 'react';

// Add token expiration check function
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token'); // Clear expired token
      setAuth(false);
      setLoading(false);
      return;
    }

    // Call a protected endpoint to check JWT token
    fetch('http://localhost:8080/api/auth/testauth', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage.jsx';
import Layout from './layout/layout.jsx';
import RevenuePage from './pages/revenuepage.jsx';
import OrdersPage from './pages/ordersPage.jsx';
import CustomerPage from './pages/customerpage.jsx';
import ProductPage from './pages/productsPage.jsx';
import './index.css';
import { CursorifyProvider } from '@cursorify/react';
import PizzaCursor from './components/PizzaCursor';

function App() {
  return (
    <>
      <PizzaCursor />
      <CursorifyProvider cursor={<PizzaCursor />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/umsatz" element={
              <Layout>
                <RevenuePage />
              </Layout>
            } />
            <Route path="/bestellungen" element={
              <Layout>
                <OrdersPage />
              </Layout>
            } />
            <Route path="/kunden" element={
              <Layout>
                <CustomerPage />
              </Layout>
            } />
            <Route path="/waren" element={
              <Layout>
                <ProductPage />
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </CursorifyProvider>
    </>
  );
}

export default App;
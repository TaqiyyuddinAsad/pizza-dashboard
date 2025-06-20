import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage.jsx';
import Layout from './layout/layout.jsx';
import RevenuePage from './pages/revenuepage.jsx';
import OrdersPage from './pages/ordersPage.jsx';
import CustomerPage from './pages/customerpage.jsx';
import './index.css';


// etc.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/umsatz" element={<Layout><RevenuePage/></Layout>} />
        <Route path="/bestellungen" element={<Layout><OrdersPage/></Layout>}/>
        <Route path="/kunden" element={<Layout><CustomerPage /></Layout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
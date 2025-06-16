import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage.jsx';
import Layout from './layout/layout.jsx';
import RevenuePage from './pages/revenuepage.jsx';
import OrdersPage from './pages/ordersPage.jsx';


// etc.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/umsatz" element={<Layout><RevenuePage/></Layout>} />
        <Route path="/bestellungen" element={<Layout><OrdersPage/></Layout>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
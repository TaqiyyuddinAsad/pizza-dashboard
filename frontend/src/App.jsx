import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage.jsx';
import Layout from './layout/layout.jsx';
import RevenuePage from './pages/revenuepage.jsx';


// etc.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/kunden" element={<Layout><KundenPage /></Layout>} />
        <Route path="/umsatz" element={<Layout><RevenuePage /></Layout>} />
        
        {/* Add more here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
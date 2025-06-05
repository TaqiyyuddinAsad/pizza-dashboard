import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* You can add more routes here later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
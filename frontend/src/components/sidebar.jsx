import { NavLink } from 'react-router-dom';
import pizzaIcon from '../assets/pizzaicon.png';
import '../styles/sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={pizzaIcon} alt="Pizza" />
        <h1>PIZZA EXPRESS</h1>
      </div>

      <p className="menu-title">MENU</p>

      <nav className="nav-links">
        <NavLink to="/umsatz" className="nav-item">📊 Finanzen</NavLink>
        <NavLink to="/kunden" className="nav-item">🛒 Kunden</NavLink>
        <NavLink to="/analyse" className="nav-item">📄 Waren – Analyse</NavLink>
        <NavLink to="/bestellungen" className="nav-item">🌀 Bestellungen</NavLink>
        
        <NavLink to="/logout" className="nav-item">🔒 Abmelden</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
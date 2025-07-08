import React, { useState, memo } from "react";
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import pizzaLogo from '../assets/pizzaicon.png'

export const Sidebar = memo(({ onToggle }) => {
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Logged out - token cleared');
    navigate('/');
  };

  const handleNavClick = (title) => {
    setSelected(title);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768 && onToggle) {
      onToggle();
    }
  };

  return (
    <nav className="sidebar">
      <TitleSection />

      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Finanzen"
          to="/umsatz"
          selected={selected}
          setSelected={handleNavClick}
        />
        <Option
          Icon={FiDollarSign}
          title="Waren"
          to="/waren"
          selected={selected}
          setSelected={handleNavClick}
        />
        <Option
          Icon={FiMonitor}
          title="Kunden"
          to="/kunden"
          selected={selected}
          setSelected={handleNavClick}
        />
        <Option
          Icon={FiShoppingCart}
          title="Bestellungen"
          to="/bestellungen"
          selected={selected}
          setSelected={handleNavClick}
        />
        <button
          className={`relative flex h-10 w-full items-center rounded-md transition-colors duration-200 text-slate-500 hover:bg-slate-100`}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <div className="grid h-full w-10 place-content-center text-lg">
            <FiTag />
          </div>
          <span className="text-xs font-medium transition-opacity duration-200">
            Abmelden
          </span>
        </button>
      </div>
    </nav>
  );
});

const Option = memo(({ Icon, title, to, selected, setSelected, notifs }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex h-10 w-full items-center rounded-md transition-colors duration-200 ${
          isActive
            ? "bg-indigo-100 text-indigo-800"
            : "text-slate-500 hover:bg-slate-100"
        }`
      }
      onClick={() => setSelected(title)}
    >
      <div className="grid h-full w-10 place-content-center text-lg">
        <Icon />
      </div>
      <span className="text-xs font-medium transition-opacity duration-200">
        {title}
      </span>
      {notifs && (
        <span className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white flex items-center justify-center">
          {notifs}
        </span>
      )}
    </NavLink>
  );
});

const TitleSection = memo(() => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="transition-opacity duration-200">
            <span className="block text-xs font-semibold text-purple-600 text-2xl font-bold">PIZZA EXPRESS</span>
            <span className="block text-xs text-slate-500"></span>
          </div>
        </div>
        <FiChevronDown className="mr-2" />
      </div>
    </div>
  );
});

const Logo = memo(() => {
  return (
    <div>
      <img
        src={pizzaLogo}    
        alt="Pizza Express Logo"
        className="h-8 w-auto" 
      />
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
Option.displayName = 'Option';
TitleSection.displayName = 'TitleSection';
Logo.displayName = 'Logo';

export default React.memo(Sidebar);

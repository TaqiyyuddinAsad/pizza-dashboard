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

export const Sidebar = memo(() => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <nav
      className="fixed left-0 top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2 z-40 transition-all duration-300 ease-in-out"
      style={{
        width: open ? "225px" : "60px",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Finanzen"
          to="/umsatz"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiDollarSign}
          title="Waren"
          to="/waren"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
        />
        <Option
          Icon={FiMonitor}
          title="Kunden"
          to="/kunden"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiShoppingCart}
          title="Bestellungen"
          to="/bestellungen"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <button
          className={`relative flex h-10 w-full items-center rounded-md transition-colors duration-200 text-slate-500 hover:bg-slate-100`}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <div className="grid h-full w-10 place-content-center text-lg">
            <FiTag />
          </div>
          {open && (
            <span className="text-xs font-medium transition-opacity duration-200">
              Abmelden
            </span>
          )}
        </button>
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
});

const Option = memo(({ Icon, title, to, selected, setSelected, open, notifs }) => {
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
      {open && (
        <span className="text-xs font-medium transition-opacity duration-200">
          {title}
        </span>
      )}
      {notifs && open && (
        <span className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white flex items-center justify-center">
          {notifs}
        </span>
      )}
    </NavLink>
  );
});

const TitleSection = memo(({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <div className="transition-opacity duration-200">
              <span className="block text-xs font-semibold text-purple-600 text-2xl font-bold">PIZZA EXPRESS</span>
              <span className="block text-xs text-slate-500"></span>
            </div>
          )}
        </div>
        {open && <FiChevronDown className="mr-2" />}
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

const ToggleClose = memo(({ open, setOpen }) => {
  return (
    <button
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <div className="grid size-10 place-content-center text-lg">
          <FiChevronsRight
            className={`transition-transform duration-200 ${open && "rotate-180"}`}
          />
        </div>
        {open && (
          <span className="text-xs font-medium transition-opacity duration-200">
            Hide
          </span>
        )}
      </div>
    </button>
  );
});

Sidebar.displayName = 'Sidebar';
Option.displayName = 'Option';
TitleSection.displayName = 'TitleSection';
Logo.displayName = 'Logo';
ToggleClose.displayName = 'ToggleClose';

export default Sidebar;

import React, { useState } from "react";
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
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import pizzaLogo from '../assets/pizzaicon.png'

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <motion.nav
      layout
      className="fixed left-0 top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2 z-40"
      style={{
        width: open ? "225px" : "fit-content",
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
<Option
  Icon={FiTag}
  title="Abmelden"
  to="/"
  selected={selected}
  setSelected={setSelected}
  open={open}
/>
        
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};


const Option = ({ Icon, title, to, selected, setSelected, open, notifs }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex h-10 w-full items-center rounded-md transition-colors ${
          isActive
            ? "bg-indigo-100 text-indigo-800"
            : "text-slate-500 hover:bg-slate-100"
        }`
      }
      onClick={() => setSelected(title)}
    >
      <motion.div className="grid h-full w-10 place-content-center text-lg">
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}
      {notifs && open && (
        <motion.span
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </NavLink>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold text-purple-600 text-2xl font-bold">PIZZA EXPRESS</span>
              <span className="block text-xs text-slate-500"></span>
            </motion.div>
          )}
        </div>
        {open && <FiChevronDown className="mr-2" />}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      
    >
      
  <motion.div layout>
    <img
      src={pizzaLogo}    
      alt="Pizza Express Logo"
      className="h-8 w-auto" 
    />
  </motion.div>

      
      
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

const ExampleContent = () => <div className="h-[200vh] w-full"></div>;

export default Sidebar;

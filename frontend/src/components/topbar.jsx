import React, { useContext } from 'react';
import avatar from '../assets/pizzaicon.png'; 
import { DarkModeContext } from '../layout/layout.jsx';
import '../styles/topbar.css';

const Topbar = ({ username }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div className="topbar dark:bg-gray-800 dark:text-white">
      <div className="user-info">
        <img src={avatar} alt="Avatar" className="avatar" />
        <span className="username">{username}</span>
      </div>
      <button
        onClick={toggleDarkMode}
        className="dark-mode-toggle bg-gray-200 dark:bg-gray-600 p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? (
          // Sun icon for light mode
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Topbar;
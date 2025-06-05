import React from 'react';
import Sidebar from '../components/sidebar.jsx';
import Topbar from '../components/topbar.jsx';


const Layout = ({ children }) => { 
  return (
    <div className="app-layout">
      <Sidebar />
      <Topbar/>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
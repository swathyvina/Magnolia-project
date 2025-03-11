import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import CustomNavbar from "./CustomNavbar";
import "./Layout.css";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-container">
      <CustomNavbar onMenuClick={toggleSidebar} />

      <div className="layout-content">
        <div className={`sidebar-container ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
          <Sidebar />
        </div>
        
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

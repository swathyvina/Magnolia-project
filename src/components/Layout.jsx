import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import CustomNavbar from "./CustomNavbar";

const Layout = () => {
  return (
    <>
      <CustomNavbar />
      <div style={{ display: "flex", height: "100vh" }}>
       
        <div style={{ width: "17%", background: "#f4f4f4", padding: "10px" }}>
          <Sidebar />
        </div>

   
        <div style={{ width: "80%", padding: "" }}>
          <Outlet />  
        </div>
      </div>
    </>
  );
};

export default Layout;

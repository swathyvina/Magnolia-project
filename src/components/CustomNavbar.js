import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import logo from "../assets/logo.png"; // Replace with your logo path
import "./CustomNavbar.css"; // Ensure you create a CSS file for styling

const CustomNavbar = () => {
  return (
    <div className="navbar">
      <div className="left">
         <div className="menu" >
           <FaBars/>
          </div>
      <div className="logo">
         <img src={logo}></img>
      </div>
    </div>
       <div className="right">
     <CgProfile />
    </div>
 </div>
    
  );
};

export default CustomNavbar;



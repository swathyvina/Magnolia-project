import React from "react";
import { FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import logo from "../assets/logo.png"; // Ensure this path is correct
import "./CustomNavbar.css";

const CustomNavbar = ({ onMenuClick }) => {
  return (
    <div className="navbar">
      {/* Left Side (Menu Icon + Logo) */}
      <div className="left">
        <button className="menu" onClick={onMenuClick}>
          <FaBars />
        </button>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      {/* Right Side (Profile Icon) */}
      <div className="right">
        <CgProfile />
      </div>
    </div>
  );
};

export default CustomNavbar;




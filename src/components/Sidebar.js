import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaBuilding,
  FaClipboardList,
  FaUsers,
  FaDatabase,
  FaHospital,
  FaCalendarAlt,
  FaBook,
  FaTrashAlt,
  FaClipboardCheck,
  FaChevronDown,
  FaChevronUp,
  FaWarehouse,
  FaIndustry,
  FaFlask,
} from "react-icons/fa";
import "./Sidebar.css";
import TestTable from "./TestTable"; // Import the TestTable component

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeItem, setActiveItem] = useState(""); // Track active menu item

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, subcategories: [] },
    { name: "Personal", icon: <FaUser />, subcategories: [] },
    { name: "OHC Operation", icon: <FaBuilding />, subcategories: [] },
    { name: "Wellness", icon: <FaHospital />, subcategories: [] },
    { name: "Roster Management", icon: <FaClipboardList />, subcategories: [] },
    { name: "Employee", icon: <FaUsers />, subcategories: [] },
    {
      name: "Master Data",
      icon: <FaDatabase />,
      hasDropdown: true,
      subcategories: [
        { name: "Organization", icon: <FaBuilding /> },
        { name: "Facility", icon: <FaWarehouse /> },
        { name: "Unit/Plant", icon: <FaIndustry /> },
        { name: "Vendor Master", icon: <FaUsers /> },
        { name: "User", icon: <FaUser /> },
        { name: "Lab Test", icon: <FaFlask /> }, // Lab Test added here
        { name: "Assessment", icon: <FaClipboardCheck /> },
      ],
    },
    { name: "Camp Management", icon: <FaClipboardCheck />, subcategories: [] },
    { name: "CMS", icon: <FaBook />, subcategories: [] },
    { name: "Lookup Data", icon: <FaDatabase />, subcategories: [] },
    { name: "Booking", icon: <FaCalendarAlt />, subcategories: [] },
    { name: "Bio Waste Management", icon: <FaTrashAlt />, subcategories: [] },
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-item">
          <div
            className="menu-main"
            onClick={() => {
              if (item.name === "Master Data") {
                setOpenDropdown(!openDropdown);
              }
              // Update active item on click
              if (item.name === "Lab Test") {
                setActiveItem("Lab Test");
              }
            }}
          >
            {item.icon}
            <span className="icon-text">{item.name}</span>
            {item.name === "Master Data" &&
              (openDropdown ? <FaChevronUp /> : <FaChevronDown />)}
          </div>

          {/* Show submenu below */}
          {openDropdown && item.name === "Master Data" && (
            <div className={`submenu ${openDropdown ? "show" : ""}`}>
              {item.subcategories.map((sub, subIndex) => (
                <div
                  key={subIndex}
                  className="submenu-item"
                  onClick={() => {
                    if (sub.name === "Lab Test") {
                      setActiveItem("Lab Test");
                    }
                  }}
                >
                  {sub.icon} <span>{sub.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Conditionally render TestTable based on active item */}
      {activeItem === "Lab Test" && <TestTable />}
    </div>
  );
};

export default Sidebar;




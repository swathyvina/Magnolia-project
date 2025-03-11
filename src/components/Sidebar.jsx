import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
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


const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
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
        { name: "Lab Test", icon: <FaFlask />, route: "/labtest" },
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
              if (item.hasDropdown) {
                setOpenDropdown(openDropdown === item.name ? null : item.name);
              } else {
                setActiveItem(item.name);
                setOpenDropdown(null);
              }
            }}
          >
            {item.icon}
            <span className="icon-text">{item.name}</span>
            {item.hasDropdown &&
              (openDropdown === item.name ? <FaChevronUp /> : <FaChevronDown />)}
          </div>

          {openDropdown === item.name && (
            <div className="submenu">
              {item.subcategories.map((sub, subIndex) => (
                <div
                  key={subIndex}
                  className={`submenu-item ${
                    activeItem === sub.name ? "active" : ""
                  }`}
                >
                  {sub.route ? (
                    <Link to={sub.route} onClick={() => setActiveItem(sub.name)}>
                      {sub.icon} <span>{sub.name}</span>
                    </Link>
                  ) : (
                    <>
                      {sub.icon} <span>{sub.name}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

     
    </div>
  );
};

export default Sidebar;


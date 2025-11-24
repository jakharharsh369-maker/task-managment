import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/Projects" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-black text-white py-6 px-4 z-50">
      <h1 className="text-xl font-bold mb-8">TaskFlow</h1>

      {menu.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg text-lg mb-2 transition ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;

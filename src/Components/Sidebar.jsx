import React from "react";
import { NavLink } from "react-router-dom";
import WorkspaceDropdown from "./WorkspaceDropdown";

const Sidebar = () => {
  const menu = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/Projects" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-black text-white py-6 px-4 z-50">
      <h1 className="text-xl font-bold mb-4">TaskFlow</h1>

      {/* 🔽 ADD THIS */}
      <WorkspaceDropdown />

      <div className="mt-6">
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
    </div>
  );
};

export default Sidebar;

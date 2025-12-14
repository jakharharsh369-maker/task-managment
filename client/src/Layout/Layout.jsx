import React from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import NavbarMinimal from "../Components/Navbar.jsx";
import FooterSimple from "../Components/Footer";

const Layout = () => {
  const { isLoaded } = useUser();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* LEFT SIDEBAR */}
      <NavbarMinimal />

      {/* RIGHT CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {!isLoaded ? (
            <div className="h-full flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <Outlet />
          )}
        </main>

        {/* FOOTER */}
        <FooterSimple />
      </div>
    </div>
  );
};

export default Layout;

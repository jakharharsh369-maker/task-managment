import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../Components/navbar";

const Layout = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex bg-white text-gray-900 min-h-screen">
      {/* Sidebar always on the left */}
      <Sidebar className="w-60 fixed h-full" />

      {/* Main screen area shifted right by sidebar width */}
      <div className="flex flex-col flex-1 ml-60 min-h-screen">
        <Navbar />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

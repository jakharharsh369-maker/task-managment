import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/navbar";
import Footer from "../Components/Footer";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const { user, isLoaded } = useUser();

  // Wait until Clerk finishes loading user data
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If user is not signed in, show SignIn screen
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn />
      </div>
    );
  }

  // If user is signed in, show the normal layout
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Child routes (like Tasks) will appear here */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

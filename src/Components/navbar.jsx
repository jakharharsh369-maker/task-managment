import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-md font-medium transition ${
      location.pathname === path
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between transition">
      <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>

      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <SignedOut>
          <Link to="/sign-in" className={linkClasses("/sign-in")}>
            Sign In
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;

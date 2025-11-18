import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Tasks from "./Pages/Tasks";
import {
  SignIn,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";

export default function App() {
  return (
    <Routes>
      {/* Default redirect to sign-in */}
      <Route path="/" element={<Navigate to="/sign-in" />} />

      {/* Clerk sign-in route */}
      <Route
        path="/sign-in/*"
        element={
          <SignIn path="/sign-in" routing="path" afterSignInUrl="/home" />
        }
      />

      {/* Home page route (protected) */}
      <Route
        path="/home"
        element={
          <>
            <SignedIn>
              <Home />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* ✅ New Tasks page route (protected) */}
      <Route
        path="/app/tasks"
        element={
          <>
            <SignedIn>
              <Tasks />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

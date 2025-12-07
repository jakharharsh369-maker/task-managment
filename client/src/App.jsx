import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Projects from "./Pages/Projects"; 
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <SignedOut>
              <SignIn />
            </SignedOut>
            <SignedIn>
              <Layout />
            </SignedIn>
          </>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="projects" element={<Projects />} />
      </Route>
    </Routes>
  );
}

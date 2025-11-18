import React from "react";
import Navbar from "../Components/navbar";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to TaskFlow</h1>
        <p className="text-gray-600 max-w-md">
          Stay organized, manage tasks, and get more done — all in one place.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

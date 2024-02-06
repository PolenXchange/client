import React, { useEffect } from "react";
import HiveSection from "../components/LandingPage/HiveSection";
import InternalMarketSection from "../components/LandingPage/InternalMarketSection";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  useEffect(() => {
    console.log(currentTheme);
  }, [currentTheme]);
  return (
    <div className={currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className={`text-4xl font-extrabold ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-900"
            }`}
          >
            Welcome to PolenXchange
          </h1>
          <p
            className={`mt-4 text-lg  ${
              currentTheme === "dark" ? "text-gray-500" : "text-gray-600"
            }`}
          >
            Buy, sell, and trade cryptocurrencies with ease, as easy as
            exchanging Polen for bees
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-lg font-medium"
            >
              Get Started
            </a>
          </div>
        </div>
      </main>
      <HiveSection />
      <InternalMarketSection />

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            © 2023-2024 Crypto Exchange. All rights reserved. Made by{" "}
            <a target="_blank" href="https://peakd.com/@igormuba">
              @igormuba
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

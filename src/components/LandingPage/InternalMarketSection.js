import React from "react";
import { useSelector } from "react-redux";

const InternalMarketSection = () => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  return (
    <section
      className={`${
        currentTheme === "dark" ? "bg-gray-600" : "bg-gray-200"
      } py-16`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={`text-3xl font-extrabold ${
              currentTheme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Hive Blockchain Internal Market
          </h2>
          <p
            className={`mt-4 text-lg  ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            The Hive blockchain has its own internal market where users can
            trade HIVE and HBD with zero fees.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InternalMarketSection;

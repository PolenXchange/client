import React from "react";
import { useSelector } from "react-redux";

const HiveSection = () => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  return (
    <section
      className={`${
        currentTheme === "dark" ? "bg-gray-700" : "bg-white"
      } py-16`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={`text-3xl font-extrabold ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-900"
            }`}
          >
            Hive Blockchain
          </h2>
          <p
            className={`mt-4 text-lg ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Hive is a decentralized blockchain-based social media platform. It
            enables users to create and share content, vote on content, and earn
            cryptocurrency rewards for their contributions.
          </p>
          <h3
            className={`mt-8 text-2xl font-bold ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            HIVE
          </h3>
          <p
            className={`mt-4 text-lg ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            HIVE is the native cryptocurrency of the Hive blockchain. It is used
            for various purposes within the ecosystem, including content
            rewards, curation, and network fees.
          </p>
          <h3
            className={`mt-8 text-2xl font-bold ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            HBD
          </h3>
          <p
            className={`mt-4 text-lg ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            HBD (Hive Backed Dollars) is a stablecoin on the Hive blockchain. It
            is designed to maintain a value pegged to the U.S. dollar. HBD can
            be used for transactions, savings, and stability within the Hive
            ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HiveSection;

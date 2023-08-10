import React, { useState } from "react";

const SwapPage = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0.0);
  const [networkFee, setNetworkFee] = useState(0.0);
  const [totalCost, setTotalCost] = useState(0.0);
  const [isHiveToHbd, setIsHiveToHbd] = useState(true);

  const handleFromAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setFromAmount(amount);
    setToAmount(amount * conversionRate);
    // Calculate and update totalCost and networkFee if needed
  };

  const handleToAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setToAmount(amount);
    setFromAmount(amount / conversionRate);
    // Calculate and update totalCost and networkFee if needed
  };

  const handleFlipConversion = () => {
    setIsHiveToHbd(!isHiveToHbd);
    setFromAmount(toAmount); // Swap the "From" and "To" amounts
    setToAmount(fromAmount);
  };

  // Add more event handlers and logic as needed

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Token Swap</h2>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-sm">
                {isHiveToHbd ? "HIVE" : "HBD"} (FROM)
              </span>
            </div>
            <input
              type="number"
              className="w-20 border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none focus:border-blue-500"
              value={fromAmount}
              onChange={handleFromAmountChange}
            />
          </div>
          {/* Add other UI elements for the "From" section */}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-sm">
                {isHiveToHbd ? "HBD" : "HIVE"} (TO)
              </span>
            </div>
            <input
              type="number"
              className="w-20 border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none focus:border-blue-500"
              value={toAmount}
              onChange={handleToAmountChange}
            />
          </div>
          {/* Add other UI elements for the "To" section */}
        </div>

        {/* Add UI elements for exchange rate, network fee, and total cost */}

        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring"
            onClick={() => {
              // Implement swap functionality here
            }}
          >
            Swap Now
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring"
            onClick={handleFlipConversion}
          >
            Flip
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;

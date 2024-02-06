import React, { useState } from "react";
import { useSelector } from "react-redux";

const TradeHistory = () => {
  // Fetch trade history state from Redux store
  const tradeHistory = useSelector((state) => state.tradeHistory);
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  // Pagination state and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the total number of pages based on the number of trade history items
  const totalPages = Math.ceil(tradeHistory.length / itemsPerPage);

  // Function to calculate the time elapsed since the trade occurred
  const getTimeElapsed = (timestamp) => {
    const now = new Date();
    const tradeTime = new Date(timestamp);
    const elapsedSeconds = Math.floor((now - tradeTime) / 1000);
    let timeElapsedString = "";
    if (elapsedSeconds < 60) {
      timeElapsedString = `${elapsedSeconds} seconds ago`;
    } else if (elapsedSeconds < 3600) {
      const minutes = Math.floor(elapsedSeconds / 60);
      timeElapsedString = `${minutes} minutes ago`;
    } else if (elapsedSeconds < 86400) {
      const hours = Math.floor(elapsedSeconds / 3600);
      timeElapsedString = `${hours} hours ago`;
    } else {
      const days = Math.floor(elapsedSeconds / 86400);
      timeElapsedString = `${days} days ago`;
    }
    return timeElapsedString;
  };

  // Function to filter trade history data based on current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageTradeHistory = tradeHistory.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to render pagination buttons
  // Function to render pagination buttons
  const renderPaginationButtons = () => {
    const maxVisiblePages = 5; // Show 5 page buttons at a time
    const pageButtons = [];

    if (totalPages <= maxVisiblePages) {
      // Show all page buttons if there are not too many pages
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`mr-2 px-3 py-1 rounded ${
              currentPage === i ? "bg-gray-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show first page button
      pageButtons.push(
        <button
          key={1}
          className={`mr-2 px-3 py-1 rounded ${
            currentPage === 1 ? "bg-gray-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );

      // Show ellipsis before the current page if applicable
      if (currentPage - Math.floor(maxVisiblePages / 2) > 2) {
        pageButtons.push(
          <span
            key="ellipsis-start"
            className={`${
              currentTheme === "dark" ? "text-gray-300" : "text-black"
            }`}
          >
            ...
          </span>
        );
      }

      // Calculate start and end page numbers for visible buttons
      let startPage = Math.max(
        currentPage - Math.floor(maxVisiblePages / 2),
        2
      );
      let endPage = Math.min(startPage + maxVisiblePages - 3, totalPages - 1);

      // Show page buttons in the middle
      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`mr-2 px-3 py-1 rounded ${
              currentPage === i ? "bg-gray-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis after the current page if applicable
      if (currentPage + Math.floor(maxVisiblePages / 2) < totalPages - 1) {
        pageButtons.push(
          <span
            key="ellipsis-end"
            className={`${
              currentTheme === "dark" ? "text-gray-300" : "text-black"
            }`}
          >
            ...
          </span>
        );
      }

      // Show last page button
      pageButtons.push(
        <button
          key={totalPages}
          className={`mr-2 px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-500 text-white"
              : "bg-gray-300"
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div
      className={`${
        currentTheme === "dark" ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg shadow-md`}
    >
      <h2
        className={`text-lg font-bold mb-4 ${
          currentTheme === "dark" ? "text-gray-300" : "text-black"
        }`}
      >
        Trade History
      </h2>
      {currentPageTradeHistory.length > 0 ? (
        <>
          <table className="w-full">
            <thead>
              <tr>
                <th
                  className={`px-2 py-1 text-center ${
                    currentTheme === "dark" ? "text-gray-400" : "text-black"
                  }`}
                >
                  Type
                </th>
                <th
                  className={`px-2 py-1 text-center ${
                    currentTheme === "dark" ? "text-gray-400" : "text-black"
                  }`}
                >
                  Price (HBD)
                </th>
                <th
                  className={`px-2 py-1 text-center ${
                    currentTheme === "dark" ? "text-gray-400" : "text-black"
                  }`}
                >
                  HIVE
                </th>
                <th
                  className={`px-2 py-1 text-center ${
                    currentTheme === "dark" ? "text-gray-400" : "text-black"
                  }`}
                >
                  HBD
                </th>
                <th
                  className={`px-2 py-1 text-center ${
                    currentTheme === "dark" ? "text-gray-400" : "text-black"
                  }`}
                >
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageTradeHistory.map((trade) => (
                <tr key={trade._id}>
                  <td
                    className={`px-2 py-1 text-center ${
                      currentTheme === "dark" ? "text-gray-300" : "text-black"
                    }`}
                  >
                    {trade.operation}
                  </td>
                  <td
                    className={`px-2 py-1 text-center ${
                      currentTheme === "dark" ? "text-gray-300" : "text-black"
                    }`}
                  >
                    {parseFloat(trade.hivePrice).toFixed(3)} HBD
                  </td>
                  <td
                    className={`px-2 py-1 text-center ${
                      currentTheme === "dark" ? "text-gray-300" : "text-black"
                    }`}
                  >
                    {trade.open_pays}
                  </td>
                  <td
                    className={`px-2 py-1 text-center ${
                      currentTheme === "dark" ? "text-gray-300" : "text-black"
                    }`}
                  >
                    {trade.current_pays}
                  </td>
                  <td
                    className={`px-2 py-1 text-center ${
                      currentTheme === "dark" ? "text-gray-300" : "text-black"
                    }`}
                  >
                    {getTimeElapsed(trade.parsed_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            {currentPage !== 1 && (
              <button
                className="mr-2 px-3 py-1 rounded bg-gray-300"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            )}
            {renderPaginationButtons()}
            {currentPage !== totalPages && (
              <button
                className="ml-2 px-3 py-1 rounded bg-gray-300"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <p
          className={`${
            currentTheme === "dark" ? "text-gray-300" : "text-black"
          }`}
        >
          No trade history
        </p>
      )}
    </div>
  );
};

export default TradeHistory;

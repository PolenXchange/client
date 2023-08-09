import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceChart from "../components/ExchangePage/ExchangeChart";
import OrderInput from "../components/ExchangePage/OrderInput";
import OrderBook from "../components/ExchangePage/OrderBook";
import MyOrders from "../components/ExchangePage/MyOrders";
import TradeHistory from "../components/ExchangePage/TradeHistory"; // Import the TradeHistory component
import axios from "axios";
import { parseFiveMinuteChart } from "../helpers/ChartHelper";
import { fetchTradeHistory, fetchMyOpenOrders } from "../redux/store"; // Update the path to your store file if needed

const ExchangePage = () => {
  // Fetch trade history state from Redux store
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.username);
  const account = useSelector((state) => state.account);

  useEffect(() => {
    // Fetch trade history data through Redux
    dispatch(fetchTradeHistory());
  }, [dispatch]);

  useEffect(() => {
    if (username) {
      dispatch(fetchMyOpenOrders(username));
    }
  }, [username, dispatch]);
  const candlestickData = [
    // { date: "2023-05-01", open: 100, high: 120, low: 80, close: 110 },
    // { date: "2023-05-02", open: 110, high: 130, low: 100, close: 120 },
    // Add more data points as needed
  ];

  return (
    <div>
      {/* Responsive layout using Flexbox */}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          <PriceChart width={800} ratio={1} />
        </div>
        <div className="w-full md:w-1/3 md:pl-4">
          {/* Side Panels Section (OrderInput, OrderBook, MyOrders) */}
          <div className="md:flex md:flex-col md:ml-4 md:order-first">
            {/* Order Input Section */}
            <OrderInput style={{ marginBottom: "20px" }} />

            {/* Order Book Section */}
            <OrderBook style={{ marginBottom: "20px" }} />
          </div>
        </div>
      </div>

      {/* Trade History Section */}
      <div className="mt-4">
        {/* My Orders Section */}
        {username && account && <MyOrders />}
        <TradeHistory />
      </div>
    </div>
  );
};

export default ExchangePage;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceChart from "../components/ExchangePage/ExchangeChart";
import OrderInput from "../components/ExchangePage/OrderInput";
import OrderBook from "../components/ExchangePage/OrderBook";
import MyOrders from "../components/ExchangePage/MyOrders";
import TradeHistory from "../components/ExchangePage/TradeHistory";
import axios from "axios";
import { parseFiveMinuteChart } from "../helpers/ChartHelper";
import { fetchTradeHistory, fetchMyOpenOrders } from "../redux/store";

const ExchangePage = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.username);
  const account = useSelector((state) => state.account);

  useEffect(() => {
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
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4  p-2 ">
        <div className="w-full md:w-2/3  p-2 shadow-md">
          <PriceChart width={800} ratio={1} />
          {/* Place OrderInput component below the chart on desktop */}
          <div className="md:block  p-2 mt-4">
            <OrderInput />
          </div>
        </div>
        <div className="w-full md:w-1/3 md:flex md:flex-col md:space-y-4  p-2">
          <OrderBook />
        </div>
      </div>

      <div className="md:hidden  p-2 mt-4">
        {/* Display OrderInput below the chart on mobile */}
        <OrderInput />
      </div>

      <div className="mt-4 space-y-4  p-2">
        {username && account && <MyOrders />}
        <TradeHistory />
      </div>
    </div>
  );
};

export default ExchangePage;

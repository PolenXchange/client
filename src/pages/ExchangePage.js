import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
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
  let socket = useRef(socketIOClient("/socket"));

  useEffect(() => {
    dispatch(fetchTradeHistory());
  }, [dispatch]);

  useEffect(() => {
    if (username) {
      dispatch(fetchMyOpenOrders(username));
    }
  }, [username, dispatch]);

  useEffect(() => {
    socket.current = socketIOClient("/socket"); // Create or reassign the socket connection
    socket.current.on("newData", (data) => {
      console.log("New data arrived form socket");
      console.log(data);
      dispatch({ type: "newDataReceived", payload: data });
    });
    return () => {
      console.log("disconnecting from socket");
      socket.current.disconnect();
    };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4  p-2 ">
        <div className="w-full md:w-2/3  p-2 shadow-md">
          <PriceChart width={800} ratio={1} />
          <div className="md:block  p-2 mt-4">
            <OrderInput />
          </div>
        </div>
        <div className="w-full md:w-1/3 md:flex md:flex-col md:space-y-4  p-2">
          <OrderBook />
        </div>
      </div>

      <div className="md:hidden  p-2 mt-4">
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

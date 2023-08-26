import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderBook } from "../../redux/store"; // Import the fetchOrderBook async thunk

const OrderBook = () => {
  const dispatch = useDispatch();

  const intervalId = useRef(null);

  useEffect(() => {
    // Fetch order book data through Redux immediately when the component mounts
    dispatch(fetchOrderBook());

    // Set up an interval to fetch order book data every 1 minute
    intervalId.current = setInterval(() => {
      dispatch(fetchOrderBook());
    }, 60000); // 60000 milliseconds = 1 minute

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId.current);
    };
  }, [dispatch]);

  // Fetch order book state from Redux store
  const orderBookData = useSelector((state) => state.orderBook);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-4 gap-4 text-center font-bold mb-2">
        <div>BUY</div>
        <div></div>
        <div></div>
        <div>SELL</div>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div
          className="col-span-2"
          style={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="flex justify-between font-bold">
            <div>HIVE</div>
            <div>Price</div>
          </div>
          {orderBookData.bids.length > 0 ? (
            orderBookData.bids.map((order, index) => (
              <div key={index} className="flex justify-between">
                <div>{order.order_price.quote.replace(" HIVE", "")}</div>
                <div>{parseFloat(order.real_price).toFixed(3)}</div>
              </div>
            ))
          ) : (
            <div>Loading buy orders...</div>
          )}
        </div>
        <div
          className="col-span-2"
          style={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="flex justify-between font-bold">
            <div>HIVE</div>
            <div>Price</div>
          </div>
          {orderBookData.asks.length > 0 ? (
            orderBookData.asks.map((order, index) => (
              <div key={index} className="flex justify-between">
                <div>{order.order_price.base.replace(" HIVE", "")}</div>
                <div>{parseFloat(order.real_price).toFixed(3)}</div>
              </div>
            ))
          ) : (
            <div>Loading sell orders...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;

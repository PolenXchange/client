import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderBook } from "../../redux/store"; // Import the fetchOrderBook async thunk

const OrderBook = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch order book data through Redux
    dispatch(fetchOrderBook());
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
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {orderBookData.bids.length > 0 ? (
            orderBookData.bids.map((order, index) => (
              <div key={index} className="flex justify-between">
                <div>{order.order_price.quote}</div>
                <div>{parseFloat(order.real_price).toFixed(3)}</div>
              </div>
            ))
          ) : (
            <div>Loading buy orders...</div>
          )}
        </div>
        <div
          className="col-span-2"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {orderBookData.asks.length > 0 ? (
            orderBookData.asks.map((order, index) => (
              <div key={index} className="flex justify-between">
                <div>{order.order_price.base}</div>
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

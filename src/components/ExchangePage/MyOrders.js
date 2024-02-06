import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyOpenOrders, fetchAccount } from "../../redux/store";
const MyOrders = () => {
  const myOpenOrders = useSelector((state) => state.openOrders);
  const username = useSelector((state) => state.auth.username);
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  const dispatch = useDispatch();

  const formatTimeAgo = (created) => {
    const now = new Date();
    const createdAt = new Date(created);
    const diff = now - createdAt;
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    }
  };

  const determineOrderType = (order) => {
    return order.sell_price.base.includes("HBD") ? "BUY" : "SELL";
  };
  const timeSince = (date) => {
    const dateNotUTC = new Date();
    let dateUTC =
      dateNotUTC.getUTCFullYear() +
      "-" +
      (dateNotUTC.getUTCMonth() < 9
        ? "0" + (dateNotUTC.getUTCMonth() + 1)
        : dateNotUTC.getUTCMonth() + 1) +
      "-" +
      (dateNotUTC.getUTCDate() > 9
        ? dateNotUTC.getUTCDate()
        : `0${dateNotUTC.getUTCDate()}`) +
      // dateNotUTC.getUTCDate() +
      "T" +
      (dateNotUTC.getUTCHours() > 9
        ? dateNotUTC.getUTCHours()
        : `0${dateNotUTC.getUTCHours()}`) +
      ":" +
      (dateNotUTC.getUTCMinutes() > 9
        ? dateNotUTC.getUTCMinutes()
        : `0${dateNotUTC.getUTCMinutes()}`) +
      ":" +
      (dateNotUTC.getUTCSeconds() > 9
        ? dateNotUTC.getUTCSeconds()
        : `0${dateNotUTC.getUTCSeconds()}`);
    let seconds = Math.floor((new Date(dateUTC) - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " mins";
    }
    return Math.floor(seconds) + " secs";
  };

  const determineHiveAmount = (order) => {
    return order.sell_price.base.includes("HBD")
      ? parseFloat(order.sell_price.quote.split(" ")[0]).toFixed(3)
      : parseFloat(order.sell_price.base.split(" ")[0]).toFixed(3);
  };

  const calculateFilledPercentage = (order) => {
    return (
      (
        (1 -
          order.for_sale /
            1000 /
            parseFloat(order.sell_price.base.split(" ")[0])) *
        100
      ).toFixed(2) + "%"
    );
  };

  const handleCancelOrder = async (orderId) => {
    const opCancel = [
      "limit_order_cancel",
      {
        orderid: orderId,
        owner: username,
      },
    ];

    await window.hive_keychain.requestBroadcast(
      username,
      [opCancel],
      "Active",
      async (response) => {
        console.log(response);
        dispatch(fetchMyOpenOrders(username));
        dispatch(fetchAccount(username));
      }
    );
  };

  return (
    <div
      className={`${
        currentTheme === "dark" ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg shadow-md `}
    >
      <h2
        className={`text-lg font-bold mb-4 ${
          currentTheme === "dark" ? "text-gray-300" : "text-black"
        }`}
      >
        My Orders
      </h2>
      {myOpenOrders.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th
                className={`text-center ${
                  currentTheme === "dark" ? "text-gray-400" : "text-black"
                }`}
              >
                Time
              </th>
              <th
                className={`text-center ${
                  currentTheme === "dark" ? "text-gray-400" : "text-black"
                }`}
              >
                Type
              </th>
              <th
                className={`text-center ${
                  currentTheme === "dark" ? "text-gray-400" : "text-black"
                }`}
              >
                Price
              </th>
              <th
                className={`text-center ${
                  currentTheme === "dark" ? "text-gray-400" : "text-black"
                }`}
              >
                HIVE Amount
              </th>
              <th
                className={`text-center ${
                  currentTheme === "dark" ? "text-gray-400" : "text-black"
                }`}
              >
                Fill %
              </th>
              <th
                className={`text-center ${
                  currentTheme === "dark" ? "text-gray-400" : "text-black"
                }`}
              ></th>
            </tr>
          </thead>
          <tbody>
            {myOpenOrders.map((order) => (
              <tr key={order.id}>
                <td
                  className={`text-center ${
                    currentTheme === "dark" ? "text-gray-300" : "text-black"
                  }`}
                >
                  {timeSince(new Date(order.created), new Date())}
                </td>
                <td
                  className={`text-center ${
                    currentTheme === "dark" ? "text-gray-300" : "text-black"
                  }`}
                >
                  {determineOrderType(order)}
                </td>
                <td
                  className={`text-center ${
                    currentTheme === "dark" ? "text-gray-300" : "text-black"
                  }`}
                >
                  {parseFloat(order.real_price).toFixed(3)}
                </td>
                <td
                  className={`text-center ${
                    currentTheme === "dark" ? "text-gray-300" : "text-black"
                  }`}
                >
                  {determineHiveAmount(order)}
                </td>
                <td
                  className={`text-center ${
                    currentTheme === "dark" ? "text-gray-300" : "text-black"
                  }`}
                >
                  {calculateFilledPercentage(order)}
                </td>
                <td
                  className={`text-center ${
                    currentTheme === "dark" ? "text-gray-400" : "text-black"
                  }`}
                >
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => handleCancelOrder(order.orderid)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p
          className={`text-center ${
            currentTheme === "dark" ? "text-gray-400" : "text-black"
          }`}
        >
          No open orders
        </p>
      )}
    </div>
  );
};

export default MyOrders;

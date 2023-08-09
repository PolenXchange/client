import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMyOpenOrders,
  fetchAccount,
  openLoginModal,
} from "../../redux/store";

const OrderInput = () => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState("");
  const username = useSelector((state) => state.auth.username);
  const account = useSelector((state) => state.account);

  const dispatch = useDispatch();

  useEffect(() => {
    if (username) {
      dispatch(fetchAccount(username));
    }
  }, [dispatch, username]);
  useEffect(() => {
    console.log("account");
    console.log(account);
  }, [account]);
  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    updateTotal(newAmount, price);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    updateTotal(amount, newPrice);
  };

  const updateTotal = (newAmount, newPrice) => {
    const newTotal = newAmount * newPrice;
    setTotal(newTotal);
  };

  const handleBuyOrderSubmit = async (e) => {
    e.preventDefault();
    // Handle buy order submission logic here
    // You can access the values of amount, price, and total from the state
    // and perform any necessary actions for a buy order
    console.log("Buy Order - Amount:", amount);
    console.log("Buy Order - Price:", price);
    console.log("Buy Order - Total:", total);
    console.log("username", username);

    if (username && (price || 0) > 0 && amount > 0 && total > 0) {
      let expiration = new Date(Date.now());
      expiration.setDate(expiration.getDate() + 27);
      expiration = expiration.toISOString().split(".")[0];

      const op = [
        "limit_order_create",
        {
          orderid: Math.floor(Date.now() / 1000),
          owner: username,
          amount_to_sell: `${parseFloat(amount * (price || 0)).toFixed(3)} HBD`,
          min_to_receive: `${parseFloat(amount).toFixed(3)} HIVE`,
          fill_or_kill: false,
          expiration: expiration,
        },
      ];

      await window.hive_keychain.requestBroadcast(
        username,
        [op],
        "Active",
        async (response) => {
          console.log(response);
          if (username) {
            dispatch(fetchAccount(username));
            dispatch(fetchMyOpenOrders(username));
          }
        }
      );
    } else if (!username) {
      //not logged in
      dispatch(openLoginModal());
    }
  };

  const handleSellOrderSubmit = async (e) => {
    e.preventDefault();
    // Handle sell order submission logic here
    // You can access the values of amount, price, and total from the state
    // and perform any necessary actions for a sell order
    console.log("Sell Order - Amount:", amount);
    console.log("Sell Order - Price:", price);
    console.log("Sell Order - Total:", total);

    if (username) {
      let expiration = new Date(Date.now());
      expiration.setDate(expiration.getDate() + 27);
      expiration = expiration.toISOString().split(".")[0];

      const op = [
        "limit_order_create",
        {
          orderid: Math.floor(Date.now() / 1000),
          owner: username,
          amount_to_sell: `${parseFloat(amount).toFixed(3)} HIVE`,
          min_to_receive: `${parseFloat(total).toFixed(3)} HBD`,
          fill_or_kill: false,
          expiration: expiration,
        },
      ];

      await window.hive_keychain.requestBroadcast(
        username,
        [op],
        "Active",
        async (response) => {
          console.log(response);
          if (username) {
            dispatch(fetchAccount(username));
            dispatch(fetchMyOpenOrders(username));
          }
        }
      );
    } else if (!username) {
      //not logged in
      dispatch(openLoginModal());
    }
  };

  return (
    <form onSubmit={handleBuyOrderSubmit}>
      <div className="mb-2">
        <label className="font-bold" htmlFor="amountInput">
          Amount:
        </label>
        <input
          id="amountInput"
          className="border border-gray-300 rounded p-2 w-full"
          type="number"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <div className="mb-2">
        <label className="font-bold" htmlFor="priceInput">
          Price:
        </label>
        <input
          id="priceInput"
          className="border border-gray-300 rounded p-2 w-full"
          type="number"
          value={price}
          onChange={handlePriceChange}
        />
      </div>
      <div className="mb-2">
        <label className="font-bold" htmlFor="totalInput">
          Total:
        </label>
        <input
          id="totalInput"
          className="border border-gray-300 rounded p-2 w-full"
          type="number"
          value={total}
          readOnly
        />
      </div>
      {account && username && (
        <div className="mb-2">
          <p className="font-bold">Account Balances:</p>
          <p>HIVE Balance: {account.balance}</p>
          <p>HBD Balance: {account.hbd_balance}</p>
        </div>
      )}
      <div className="flex">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          type="submit"
        >
          Buy
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={handleSellOrderSubmit}
        >
          Sell
        </button>
      </div>
    </form>
  );
};

export default OrderInput;

import React, { useState, useEffect } from "react";
import {
  fetchOrderBook,
  openLoginModal,
  fetchAccount,
  fetchMyOpenOrders,
} from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "debounce";
import MyOrders from "../components/ExchangePage/MyOrders";

const SwapPage = () => {
  const [fromAmount, setFromAmount] = useState("0");
  const [toAmount, setToAmount] = useState("0");
  const [conversionRate, setConversionRate] = useState(0.0);
  const [networkFee, setNetworkFee] = useState(0.0);
  const [totalCost, setTotalCost] = useState(0.0);
  const [maxOffset, setMaxOffset] = useState(0.0);

  const [isHiveToHbd, setIsHiveToHbd] = useState(true);
  const [fromGreaterThanBalance, setFromGreaterThanBalance] = useState(true);
  const [priceImpact, setPriceImpact] = useState("0");
  const [lastMarketBookUpdate, setLastMarketBookUpdate] = useState(Date.now());

  const dispatch = useDispatch();
  const orderBook = useSelector((state) => state.orderBook);
  const username = useSelector((state) => state.auth.username);
  const account = useSelector((state) => state.account);

  useEffect(() => {
    // Fetch order book data through Redux
    dispatch(fetchOrderBook());
    dispatch(fetchAccount(username));
  }, [dispatch]);

  const handleFromAmountChange = (e) => {
    const amount = parseFloat(e.target.value);

    let amountSpent = 0;
    let amountGot = 0;
    let firstBookOrder = 0;
    let lastBookOrder = 0;
    if (!isNaN(amount)) {
      if (!isHiveToHbd && orderBook.asks.length > 0 && amount > 0) {
        if (
          username &&
          amount > parseFloat(account.hbd_balance.split(" ")[0])
        ) {
          setFromGreaterThanBalance(true);
        } else {
          setFromGreaterThanBalance(false);
        }
        let indexOfAsks = 0;
        firstBookOrder = parseFloat(orderBook.asks[indexOfAsks].real_price);
        while (amountSpent < amount && indexOfAsks < orderBook.asks.length) {
          if (orderBook.asks[indexOfAsks].hbd / 1000 >= amount - amountSpent) {
            amountGot +=
              (amount - amountSpent) /
              parseFloat(orderBook.asks[indexOfAsks].real_price);
            amountSpent += amount - amountSpent;
          } else {
            amountGot +=
              orderBook.asks[indexOfAsks].hbd /
              1000 /
              parseFloat(orderBook.asks[indexOfAsks].real_price);
            amountSpent += orderBook.asks[indexOfAsks].hbd / 1000;
          }
          indexOfAsks += 1;
        }
        lastBookOrder = parseFloat(orderBook.asks[indexOfAsks - 1].real_price);

        setPriceImpact(
          `${((lastBookOrder * 100) / firstBookOrder - 100).toFixed(3)}%`
        );
      } else if (isHiveToHbd && orderBook.bids.length > 0 && amount > 0) {
        if (
          account.authenticated &&
          amount > parseFloat(account.balance.split(" ")[0])
        ) {
          setFromGreaterThanBalance(true);
        } else {
          setFromGreaterThanBalance(false);
        }
        let indexOfBids = 0;
        firstBookOrder = parseFloat(orderBook.bids[indexOfBids].real_price);
        while (amountSpent < amount && indexOfBids < orderBook.bids.length) {
          if (orderBook.bids[indexOfBids].hive / 1000 >= amount - amountSpent) {
            amountGot +=
              (amount - amountSpent) *
              parseFloat(orderBook.bids[indexOfBids].real_price);
            amountSpent += amount - amountSpent;
          } else {
            amountGot +=
              (orderBook.bids[indexOfBids].hive / 1000) *
              parseFloat(orderBook.bids[indexOfBids].real_price);
            amountSpent += orderBook.bids[indexOfBids].hive / 1000;
          }
          indexOfBids += 1;
        }
        lastBookOrder = parseFloat(orderBook.bids[indexOfBids - 1].real_price);
        setPriceImpact(
          `${(100 - (lastBookOrder * 100) / firstBookOrder).toFixed(3)}%`
        );
      }
      setFromAmount(parseFloat(amountSpent.toFixed(4).slice(0, -1)));
      setToAmount(parseFloat(amountGot.toFixed(18).slice(0, -15)));
    } else {
      setFromAmount(e.target.value);
    }
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

  const buyHIVE = async () => {
    if (username && fromAmount > 0 && toAmount > 0) {
      let expiration = new Date(Date.now());
      expiration.setDate(expiration.getDate() + 27);
      expiration = expiration.toISOString().split(".")[0];
      const op = [
        "limit_order_create",
        {
          orderid: Math.floor(Date.now() / 1000),
          owner: account.name,
          amount_to_sell: `${fromAmount.toFixed(3)} HBD`,
          min_to_receive: `${(toAmount * (1 - maxOffset / 100)).toFixed(
            3
          )} HIVE`,
          fill_or_kill: false,
          expiration: expiration,
        },
      ];

      await window.hive_keychain.requestBroadcast(
        account.name,
        [op],
        "Active",
        async (response) => {
          console.log(response);
          console.log("Operation sent");
          dispatch(fetchAccount(username));
          dispatch(fetchMyOpenOrders(username));
          dispatch(fetchOrderBook());
        }
      );
    } else if (!account.name) {
      //not logged in
      dispatch(openLoginModal());
    }
  };

  const buyHBD = async () => {
    console.log("buying hive");
    console.log("account");
    console.log(account);
    console.log("account.name");
    console.log(account.name);
    if (account.name && fromAmount > 0 && toAmount > 0) {
      let expiration = new Date(Date.now());
      expiration.setDate(expiration.getDate() + 27);
      expiration = expiration.toISOString().split(".")[0];
      const op = [
        "limit_order_create",
        {
          orderid: Math.floor(Date.now() / 1000),
          owner: account.name,
          amount_to_sell: `${fromAmount.toFixed(3)} HIVE`,
          min_to_receive: `${(toAmount * (1 - maxOffset / 100)).toFixed(
            3
          )} HBD`,
          fill_or_kill: false,
          expiration: expiration,
        },
      ];

      await window.hive_keychain.requestBroadcast(
        account.name,
        [op],
        "Active",
        async (response) => {
          console.log(response);
          console.log("Operation sent");
          dispatch(fetchAccount(username));
          dispatch(fetchMyOpenOrders(username));
          dispatch(fetchOrderBook());
        }
      );
    } else if (!account.name) {
      //not logged in
      dispatch(openLoginModal());
    }
  };

  // Add more event handlers and logic as needed

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
              className="w-64 border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none focus:border-blue-500"
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
            <div className="w-64 border border-gray-300 rounded py-1 px-2 text-sm focus:outline-none focus:border-blue-500">
              {toAmount}
            </div>
          </div>
          {/* Add other UI elements for the "To" section */}
        </div>

        {/* Add UI elements for exchange rate, network fee, and total cost */}

        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring"
            onClick={() => {
              console.log("isHiveToHbd");
              console.log(isHiveToHbd);

              if (!isHiveToHbd) {
                buyHIVE();
              } else if (isHiveToHbd) {
                buyHBD();
              }
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
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <MyOrders />
      </div>
    </div>
  );
};

export default SwapPage;

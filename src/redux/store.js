import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import authReducer, { setLoggedIn, logout } from "./auth/authSlice";
import { login } from "./auth/authThunk";
import themeReducer from "./theme/themeSlice";
import axios from "axios";

// Async thunk to fetch trade history
export const fetchTradeHistory = createAsyncThunk(
  "tradeHistory/fetchTradeHistory",
  async () => {
    try {
      const result = await axios.get(`/api/tradehistory?now=${Date.now()}`);
      return result.data;
    } catch (error) {
      throw new Error("Failed to fetch trade history.");
    }
  }
);

// Async thunk to fetch order book data
export const fetchOrderBook = createAsyncThunk(
  "orderBook/fetchOrderBook",
  async () => {
    try {
      const result = await axios.get(`/api/orderbook?now=${Date.now()}`);
      return result.data;
    } catch (error) {
      throw new Error("Failed to fetch order book data.");
    }
  }
);

// Async thunk to fetch trade history
export const fetchMyOpenOrders = createAsyncThunk(
  "tradeHistory/fetchMyOpenOrders",
  async (username) => {
    try {
      const result = await axios.get(
        `/api/openorders?account=${username}&now=${Date.now()}`
      );
      return result.data;
    } catch (error) {
      throw new Error("Failed to fetch trade history.");
    }
  }
);

export const fetchAccount = createAsyncThunk(
  "tradeHistory/getaccount",
  async (username) => {
    try {
      const result = await axios.get(
        `/api/getaccount?account=${username}&now=${Date.now()}`
      );
      return result.data[0];
    } catch (error) {
      throw new Error("Failed to fetch trade history.");
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState: [],
  reducers: {
    // You can add any additional reducers for updating the open orders state here
    resetAccount: () => [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.fulfilled, (state, action) => {
        // Update the state with the fetched open orders data
        return action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        // Handle error if needed
      });
  },
});

const openOrdersSlice = createSlice({
  name: "openOrders",
  initialState: [],
  reducers: {
    // You can add any additional reducers for updating the open orders state here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOpenOrders.fulfilled, (state, action) => {
        // Update the state with the fetched open orders data
        return action.payload;
      })
      .addCase(fetchMyOpenOrders.rejected, (state, action) => {
        // Handle error if needed
      });
  },
});
const orderBookSlice = createSlice({
  name: "orderBook",
  initialState: { bids: [], asks: [] },
  reducers: {
    // You can add any additional reducers for updating the order book state here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderBook.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchOrderBook.rejected, (state, action) => {
        // Handle error if needed
      });
  },
});

const tradeHistorySlice = createSlice({
  name: "tradeHistory",
  initialState: [],
  reducers: {
    // You can add any additional reducers for updating the trade history state here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchTradeHistory.rejected, (state, action) => {
        // Handle error if needed
      })
      .addCase("newDataReceived", (state, action) => {
        console.log("adding new data to state");
        console.log(action.payload);
        let newState = [...action.payload, ...state];
        console.log("new state");
        console.log(newState);
        return newState; // Append new data to existing state
      });
  },
});

const modalLoginSlice = createSlice({
  name: "modalLogin",
  initialState: {
    isLoginModalOpen: false,
  },
  reducers: {
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
  },
});

// Create store
const store = configureStore({
  reducer: {
    auth: authReducer,
    tradeHistory: tradeHistorySlice.reducer,
    orderBook: orderBookSlice.reducer,
    openOrders: openOrdersSlice.reducer,
    account: accountSlice.reducer,
    modalLogin: modalLoginSlice.reducer,
    theme: themeReducer,
    // Add more slices here if needed
  },
});

// Export actions
export const { resetAccount } = accountSlice.actions;
export const { openLoginModal, closeLoginModal } = modalLoginSlice.actions;

export default store;

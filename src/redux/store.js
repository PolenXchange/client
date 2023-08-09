import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state
const initialState = {
  isLoggedIn: false,
  username: "",
};

// Define an async thunk for the login action
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { dispatch }) => {
    const result = await authenticate(payload.username);

    if (result.data.username) {
      dispatch(authSlice.actions.setLoggedIn(result.data.username));
      payload.onClose(); // Call onClose after successful login
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = "";
    },
  },
});

const authenticate = async (user) =>
  new Promise((resolve, reject) => {
    if (!window.hive_keychain) {
      return reject("Keychain not found");
    }

    window.hive_keychain.requestSignBuffer(
      user,
      `${user}${Date.now()}`,
      "Active",
      async function (result) {
        if (result.error) {
          return reject(result.error);
        }
        return resolve(result);
      }
    );
  });

// Async thunk to fetch trade history
export const fetchTradeHistory = createAsyncThunk(
  "tradeHistory/fetchTradeHistory",
  async () => {
    try {
      const result = await axios.get("/api/tradehistory");
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
      const result = await axios.get("/api/orderbook");
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
      const result = await axios.get(`/api/openorders?account=${username}`);
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
      const result = await axios.get(`/api/getaccount?account=${username}`);
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
    auth: authSlice.reducer,
    tradeHistory: tradeHistorySlice.reducer,
    orderBook: orderBookSlice.reducer,
    openOrders: openOrdersSlice.reducer,
    account: accountSlice.reducer,
    modalLogin: modalLoginSlice.reducer,
    // Add more slices here if needed
  },
});

// Export actions
export const { setLoggedIn, logout } = authSlice.actions;
export const { resetAccount } = accountSlice.actions;
export const { openLoginModal, closeLoginModal } = modalLoginSlice.actions;

export default store;

import { createSlice } from "@reduxjs/toolkit";

const initialUsername = localStorage.getItem("username") || "";

const initialState = {
  username: initialUsername,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.username = action.payload;
      localStorage.setItem("username", action.payload);
    },
    logout: (state) => {
      state.username = "";
      localStorage.removeItem("username");
    },
  },
});

export const { setLoggedIn, logout } = authSlice.actions;

export default authSlice.reducer;

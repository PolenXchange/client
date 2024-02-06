import { createSlice } from "@reduxjs/toolkit";

const localStorageTheme = localStorage.getItem("theme");

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentTheme: localStorageTheme ? localStorageTheme : "dark", // Default theme is dark if not set in local storage
  },
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      localStorage.setItem("theme", action.payload); // Save the theme preference to local storage
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;

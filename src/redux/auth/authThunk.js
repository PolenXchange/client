import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoggedIn } from "./authSlice";

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

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { dispatch }) => {
    const result = await authenticate(payload.username);

    if (result.data.username) {
      dispatch(setLoggedIn(result.data.username));
      payload.onClose(); // Call onClose after successful login
    }
  }
);

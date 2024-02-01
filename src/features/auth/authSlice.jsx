import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("jwt") || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("jwt", state.token)
      // Cookies.set('jwt', state.token, {expires: 14})
    },
    logout: (state, action) => {
      state.token = null;
      localStorage.removeItem("jwt")
      // Cookies.remove("jwt", {path: ''})
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectToken = (state) => state.auth.token;

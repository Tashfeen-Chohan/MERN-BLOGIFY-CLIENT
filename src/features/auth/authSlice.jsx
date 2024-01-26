import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token")||null,
  },
  reducers: {
    setCredentials: (state, action) => {
      // const { accessToken } = action.payload;
      state.token = action.payload;
      localStorage.setItem("token", state.token)
    },
    logout: (state, action) => {
      state.token = null;
      localStorage.removeItem("token")
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectToken = (state) => state.auth.token;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: "https://mern-blogify-server.vercel.app/",
    // baseUrl: "http://localhost:3000/",
    prepareHeaders: (headers, {getState}) => {
      // GET THE JWT FROM YOUR REDUX STORE OR WHEREVER IT IS STORED
      const token = getState().auth.token
      if (token) {
        // IF TOKEN EXISTS, ADD IT TO THE HEADERS
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ["Category", "User", "Post"],
  endpoints: (builder) => ({}),
});

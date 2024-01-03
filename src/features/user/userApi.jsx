import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (url) => url,
      providesTags: ["Users"]
    })
  })
});

export const {
  useGetUsersQuery
} = userApi

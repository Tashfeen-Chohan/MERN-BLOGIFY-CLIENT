import { apiSlice } from "../../app/apiSlice";

export const userApi = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (url) => url,
      providesTags: ["User"]
    })
  })
});

export const {
  useGetUsersQuery
} = userApi

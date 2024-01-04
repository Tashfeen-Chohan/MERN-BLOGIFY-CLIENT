import { apiSlice } from "../../app/apiSlice";

export const userApi = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    // GET ALL USERS
    getUsers: builder.query({
      query: (url) => url,
      providesTags: ["User"]
    }),
    // NEW USER
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser
      }),
      invalidatesTags: ["User"]
    }),
    // DELETE USER
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["User"]
    })

  })
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
} = userApi

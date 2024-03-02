import { apiSlice } from "../../app/apiSlice";

export const userApi = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    // GET ALL USERS
    getUsers: builder.query({
      query: (url) => url,
      providesTags: ["User"]
    }),
    // TOTAL USERS
    totalUsers: builder.query({
      query: () => "/users/total-users",
      providesTags: ["User"]
    }),
    // GET SINGLE USER
    getSingleUser: builder.query({
      query: (slug) => `/users/${slug}`,
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
    // UPDATE USER
    updateUser: builder.mutation({
      query: ({slug, ...updatedUser}) => ({
        url: `/users/${slug}`,
        method: "PATCH",
        body: updatedUser
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
    }),
    changePassword: builder.mutation({
      query: (updatedPassword) => ({
        url: "/users",
        method: "PATCH",
        body: updatedPassword
      })
    })

  })
});

export const {
  useGetUsersQuery,
  useGetSingleUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useTotalUsersQuery
} = userApi

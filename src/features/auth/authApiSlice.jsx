import { apiSlice } from "../../app/apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    // LOGOUT
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      })
    })
  }),
});

export const {
  useLoginMutation,
  useSendLogoutMutation,
} = authApiSlice

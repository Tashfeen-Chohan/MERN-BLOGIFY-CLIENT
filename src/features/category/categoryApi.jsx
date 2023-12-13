import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  tagTypes: ["Categories"],

  endpoints: (builder) => ({
    // GET ALL CATEGORIES
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"]
    })
  })
})

export const {
  useGetCategoriesQuery 
} = categoryApi;
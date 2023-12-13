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
    }),

    // GET SINGLE CATEGORY
    getSingleCategory: builder.query({
      query: (id) => `/categories/${id}`
    }),

    // ADD NEW CATEGORY
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory
      })
    }),

    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: (updatedCategory) => ({
        url: `/category/${updatedCategory._id}`,
        method: "PATCH",
        body: updatedCategory
      })
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE"
      })
    })
  })
})

export const {
  useGetCategoriesQuery ,
  useGetSingleCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
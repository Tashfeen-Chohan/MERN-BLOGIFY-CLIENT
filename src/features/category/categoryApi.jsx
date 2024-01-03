import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { apiSlice } from "../../app/apiSlice";


export const categoryApi = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    // GET ALL CATEGORIES
    getCategories: builder.query({
      query: (url) => url,
      providesTags: ["Category"]
    }),

    // GET SINGLE CATEGORY
    getSingleCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: ["Category"]
    }),

    // ADD NEW CATEGORY
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory
      }),
      invalidatesTags: ["Category"]
    }),

    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: ({id, ...updatedCategory}) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: updatedCategory
      }),
      invalidatesTags: ["Category"]
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Category"]
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
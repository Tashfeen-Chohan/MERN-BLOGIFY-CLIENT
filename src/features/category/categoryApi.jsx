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
      query: (id) => `/categories/${id}`,
      providesTags: ["Categories"]
    }),

    // ADD NEW CATEGORY
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory
      }),
      invalidatesTags: ["Categories"]
    }),

    // UPDATE CATEGORY
    updateCategory: builder.mutation({
      query: ({id, ...updatedCategory}) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: updatedCategory
      }),
      invalidatesTags: ["Categories"]
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Categories"]
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
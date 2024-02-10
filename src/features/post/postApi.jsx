import { apiSlice } from "../../app/apiSlice";

export const postApi = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    // GET ALL POSTS
    getPosts: builder.query({
      query: (url) => url,
      providesTags: ["Post"]
    }),

    // GET SINGLE POST
    getSinglePost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: ["Post"],
      // invalidatesTags: ["Post"]
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg }] // Invalidate cache for the specific post ID
    }),

    // CREATE NEW POST  
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost
      }),
      invalidatesTags: ["Post"]
    }),

    // UPDATE POST
    updatePost: builder.mutation({
      query: ({id, ...updatedPost}) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: updatedPost
      }),
      invalidatesTags: ["Post"]
    }),

    // DELETE POST
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Post"]
    })
  })
})

export const {
  useGetPostsQuery ,
  useGetSinglePostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = postApi;
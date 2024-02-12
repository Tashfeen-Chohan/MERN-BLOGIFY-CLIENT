import { apiSlice } from "../../app/apiSlice";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL POSTS
    getPosts: builder.query({
      query: (url) => url,
      providesTags: (result, error, arg) => [{type: "Post", id: arg.id}]
    }),

    // GET SINGLE POST
    getSinglePost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, arg) => [{type: "Post", id: arg.id}]
    }),

    // CREATE NEW POST
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Post"]
    }),

    // UPDATE POST
    updatePost: builder.mutation({
      query: ({ id, ...updatedPost }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: updatedPost,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    // DELETE POST
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    // LIKE POST
    likePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    // LIKE POST
    unlikePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/unlike`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    // VIEW POST
    viewPost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/view`,
        method: "Post"
      }),
      invalidatesTags: (result, error, arg) => [{type: "Post", id: arg.id}]
    })
  }),
});

export const {
  useGetPostsQuery,
  useGetSinglePostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useViewPostMutation
} = postApi;

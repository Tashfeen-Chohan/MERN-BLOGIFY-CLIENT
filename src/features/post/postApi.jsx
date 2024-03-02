import { apiSlice } from "../../app/apiSlice";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL POSTS
    getPosts: builder.query({
      query: (url) => url,
      providesTags: (result, error, arg) => [
        { type: "Post", id: arg.id }, // Tag for Post type
        { type: "Category"}, // Tag for Category type
        {type: "User"}
      ]
    }),

    // GET TOTAL LIKES AND VIEWS
    getTotalLikesAndViews: builder.query({
      query: (url) => url,
      providesTags: ["Post"]
    }),

    // GET SINGLE POST
    getSinglePost: builder.query({
      query: (slug) => `/posts/${slug}`,
      providesTags: (result, error, arg) => [
        {type: "Post", id: arg.id},
        {type: "Category"},
        {type: "User"},
      ]
    }),

    // CREATE NEW POST
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Post", "Category", "User"]
    }),

    // UPDATE POST
    updatePost: builder.mutation({
      query: ({ slug, ...updatedPost }) => ({
        url: `/posts/${slug}`,
        method: "PATCH",
        body: updatedPost,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.id },
        {type: "Category"},
        {type: "User"},
      ],
    }),

    // DELETE POST
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.id },
        {type: "Category"},
        {type: "User"}
      ],
    }),

    // LIKE POST
    likePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),

    // VIEW POST
    viewPost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/view`,
        method: "PATCH"
      }),
      invalidatesTags: (result, error, arg) => [{type: "Post", id: arg.id}]
    })
  }),
});

export const {
  useGetPostsQuery,
  useGetSinglePostQuery,
  useGetTotalLikesAndViewsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useViewPostMutation
} = postApi;

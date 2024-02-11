import { apiSlice } from "../../app/apiSlice";

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL POSTS
    getPosts: builder.query({
      query: (url) => url,
      providesTags: (result, error, id) => [{type: "Post", id}]

      // providesTags: (result, error, arg) => {
      //   if (result?.ids) {
      //     return [
      //       { type: "Post", id: "LIST" },
      //       ...result.ids.map((id) => ({ type: "Post", id })),
      //     ];
      //   } else return [{ type: "Post", id: "LIST" }];
      // },
    }),

    // GET SINGLE POST
    getSinglePost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{type: "Post", id}],
      invalidatesTags: (result, error, id) => [{ type: "Post", id }], // Invalidate cache for the specific post ID
      // invalidatesTags: ["Post"]
    }),

    // CREATE NEW POST
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // UPDATE POST
    updatePost: builder.mutation({
      query: ({ id, ...updatedPost }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: updatedPost,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // DELETE POST
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // LIKE POST
    likePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetSinglePostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
} = postApi;

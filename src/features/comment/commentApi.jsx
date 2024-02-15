import { apiSlice } from "../../app/apiSlice";

export const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL COMMENTS
    getAllComments: builder.query({
      query: (url) => url,
      providesTags: (result, error, arg) => [{type: "Comment", id: arg.id}]
    }),

    // GET POST COMMENTS
    getPostComments: builder.query({
      query: (url) => url,
      providesTags: (result, error, arg) => [{type: "Comment", id: arg.id}]
    }),

    // CREATE NEW COMMENT
    createComment: builder.mutation({
      query: (newComment) => ({
        url: "/comments/create",
        method: "POST",
        body: newComment
      }),
      invalidatesTags: ["Comment"]
    }),

    // LIKE COMMENT
    likeComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/likeComment/${commentId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [{type: "Comment", id: arg.id}]
    }),

    // EDIT COMMENT
    editComment: builder.mutation({
      query: ({id, ...editedComment}) => ({
        url: `/comments/editComment/${id}`,
        method: "PATCH",
        body: editedComment
      }),
      invalidatesTags: (result, error, arg) => [{type: "Comment", id: arg.id}]
    }),

    // DELETE COMMENT
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/deleteComment/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [{type: "Comment", id: arg.id}]
    })
  })
})

export const   {
  useGetAllCommentsQuery,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useLikeCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = commentApi; 
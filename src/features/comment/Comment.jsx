import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetPostCommentsQuery,
  useLikeCommentMutation,
} from "./commentApi";
import { toast } from "react-toastify";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";

const Comment = ({ postId }) => {
  const url = `/comments/getPostComments/${postId}`;
  const { data } = useGetPostCommentsQuery(url);
  const [createComment] = useCreateCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation()
  const { id: userId, username, email, profile, isAdmin } = useAuth();
  const [commentContent, setCommentContent] = useState("");

  const { comments, totalComments } = data ?? {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createComment({
        content: commentContent,
        userId,
        postId,
      });
      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success(res.data.message);
        setCommentContent("");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await likeComment(id);
      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteComment(id)
      if (res.error){
        toast.error(res.error.data.message)
      } else {
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {userId ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={profile}
            alt=""
          />
          <Link to={"/"} className="text-xs text-cyan-600 hover:underline">
            @{username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/login"}>
            Sign In
          </Link>
        </div>
      )}
      {userId && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3 bg-slate-50"
        >
          <textarea
            cols="30"
            rows="3"
            placeholder="Add a comment..."
            className="w-full p-2 border  border-gray-400 rounded outline-none"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - commentContent.length} characters remaining
            </p>
            <button
              type="submit"
              className="bg-cyan-500 text-white py-1 px-3 rounded shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* SHOWING POST COMMENT */}
      <div>
        {totalComments === 0 ? (
          <p className="mt-7 text-sm">No comment yet!</p>
        ) : (
          <div className="flex justify-between items-center mt-7">
            <span className="text-sm">Comments ({totalComments})</span>
            <select className="outline-none py-1 px-3 text-sm border-b border-gray-400">
              <option value="">Recent</option>
              <option value="">Top</option>
            </select>
          </div>
        )}

        {/* ALL COMMENTS */}
        {comments?.map((val) => (
          <div
            className="flex justify-start items-start gap-3 mt-5 w-full"
            key={val._id}
          >
            {/* PROFILE */}
            <div className="w-8 h-9 rounded-full overflow-hidden">
              <img
                className="w-full h-full rounded-full object-cover"
                src={val.userId.profile}
                alt=""
              />
            </div>
            <div className="w-full">
              {/* USERNAME & DATE */}
              <div className="flex justify-start  items-center gap-4 text-sm">
                <span className="font-bold  ">{val.userId.username}</span>
                <span className="text-xs">
                  {moment(val.createdAt).fromNow()}
                </span>
              </div>
              {/* CONTENT */}
              <span className="text-sm">{val.content}</span>
              <hr className="w-20 my-1" />
              {/* LIKE, EDIT & DELETE */}
              <div className="flex justify-start items-center gap-3 mb-1">
                <button
                  type="button"
                  onClick={() => handleLike(val._id)}
                  className={`text-gray-400 hover:text-blue-500 ${
                    userId && val.likedBy.includes(userId) && "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-sm my-2" />
                </button>
                <p className="text-gray-400 text-sm">
                  {val.likes > 0 &&
                    val.likes + " " + (val.likes === 1 ? "like" : "likes")}
                </p>
                {userId === val.userId._id && <button
                  type="button"
                  // onClick={handleEdit}
                  className="text-gray-400 hover:text-blue-500 text-sm"
                >
                  Edit
                </button>}
                {(userId === val.userId._id || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(val._id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <hr />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;

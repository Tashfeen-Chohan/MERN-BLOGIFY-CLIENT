import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useGetPostCommentsQuery,
  useLikeCommentMutation,
} from "./commentApi";
import { toast } from "react-toastify";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { BarLoader, BeatLoader, ClipLoader } from "react-spinners";
import Swal from "sweetalert2";

const Comment = ({ postId }) => {
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(3);
  const url = `/comments/getPostComments/${postId}?sortBy=${sort}&limit=${limit}`;
  const { data, isLoading, isFetching, refetch } = useGetPostCommentsQuery(url);
  const [createComment] = useCreateCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [editComment] = useEditCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const { id: userId, username, profile, slug, isAdmin } = useAuth();
  const [commentContent, setCommentContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editCommentId, setEditCommentId] = useState("");
  const [editedComment, setEditedComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentLikeLoading, setCommentLikeLoading] = useState(false);
  const [likeCommentId, setLikeCommentId] = useState("");
  const [commentEditLoading, setCommentEditLoading] = useState(false);
  const [commentDelLoading, setCommentDelLoading] = useState(false);
  const navigate = useNavigate();

  const { comments, totalComments } = data ?? {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCommentLoading(true);
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
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async (id) => {
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      setCommentLikeLoading(true);
      const res = await likeComment(id);
      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCommentLikeLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Delete",
        width: "27rem",
        customClass: {
          title: "!font-bold",
          confirmButton:
            "!py-1 !px-4 !bg-red-600 !hover:bg-red-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          cancelButton:
            "!py-1 !px-4 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });

      if (result.isConfirmed) {
        setCommentDelLoading(true);
        const response = await deleteComment(id);
        if (response.error) {
          Swal.fire({
            title: "Error!",
            text: response.error.data.message,
            width: "27rem",
            customClass: {
              title: "!text-red-500 !font-bold",
              confirmButton:
                "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
            },
          });
        } else {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occured on the server!",
        width: "27rem",
        customClass: {
          title: "!text-red-500 !font-bold",
          confirmButton:
            "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });
      console.log("Error deleting category");
    } finally {
      setCommentDelLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setCommentEditLoading(true);
      const res = await editComment({
        id,
        content: editedComment,
      });
      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success(res.data.message);
        refetch();
        setEditMode(false);
        setEditCommentId("");
        setEditedComment("");
      }
    } catch (error) {
      toast.error("An unexpected error occured on the server!");
    } finally {
      setCommentEditLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {userId ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-6 w-6 object-cover rounded-full"
            src={profile}
            alt=""
          />
          <Link
            to={`/profile/${slug}`}
            className="text-xs text-cyan-600 hover:underline"
          >
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
              className="bg-cyan-500 hover:bg-cyan-400 transition-colors duration-300 text-white py-1 px-3 rounded shadow-md"
            >
              {commentLoading ? (
                <BarLoader color="white" className="my-2" />
              ) : (
                "Submit"
              )}
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
            <select
              onChange={(e) => setSort(e.target.value)}
              className="outline-none py-1 px-3 text-sm border-b border-gray-400"
            >
              <option value="">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="top">Top</option>
            </select>
          </div>
        )}

        {/* ALL COMMENTS */}
        {isLoading ? (
          <div className="w-full flex justify-center items-center my-10">
            <BeatLoader color="#000000" size={15} />
          </div>
        ) : (
          <>
            {comments?.map((val) => (
              <div
                className="flex justify-start items-start gap-3 mt-5 w-full"
                key={val._id}
              >
                {/* PROFILE */}
                <div className="w-9 h-9 rounded-full overflow-hidden">
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
                    {/* {val.updatedAt !== val.createdAt && <span>(edited)</span>} */}
                  </div>
                  {/* CONTENT */}
                  {editMode && editCommentId === val._id ? (
                    <div className="my-2">
                      <textarea
                        className="w-full p-2 border  border-gray-400 rounded outline-none"
                        cols="30"
                        rows="2"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end items-center gap-3 mt-1">
                        <button
                          onClick={() => handleEdit(val._id)}
                          className="bg-cyan-500 hover:bg-cyan-400 transition-colors duration-300 text-white py-1 px-4 rounded shadow-md text-sm"
                        >
                          {commentEditLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="bg-red-500 hover:bg-red-600 transition-colors duration-300 text-sm text-white py-1 px-3 rounded shadow-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm">{val.content}</span>
                      <hr className="w-20 my-1" />
                      {/* LIKE, EDIT & DELETE */}
                      <div className="flex justify-start items-center gap-3 mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            handleLike(val._id);
                            setLikeCommentId(val._id);
                          }}
                        >
                          {likeCommentId === val._id && commentLikeLoading ? (
                            <ClipLoader size={15} />
                          ) : val.likedBy.includes(userId) ? (
                            <FaThumbsUp className="text-sm my-2 text-blue-500" />
                          ) : (
                            <FaThumbsUp className="text-sm my-2 text-gray-400" />
                          )}
                        </button>
                        <p className="text-gray-400 text-sm">
                          {val.likes > 0 &&
                            val.likes +
                              " " +
                              (val.likes === 1 ? "like" : "likes")}
                        </p>
                        {userId === val.userId._id && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditMode(true);
                              setEditCommentId(val._id);
                              setEditedComment(val.content);
                            }}
                            className="text-gray-400 hover:text-blue-500 text-sm"
                          >
                            Edit
                          </button>
                        )}
                        {(userId === val.userId._id ||
                          userId === val.postId.author ||
                          isAdmin) && (
                          <button
                            type="button"
                            onClick={() => handleDelete(val._id)}
                            className="text-gray-400 hover:text-red-500 text-sm"
                          >
                            {commentDelLoading ? <span className="text-red-500">Deleting...</span> : "Delete"}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                  <hr />
                </div>
              </div>
            ))}
            {totalComments > 3 && (
              <div className="flex justify-center items-center mt-7">
                <button
                  onClick={() => setLimit(limit + 3)}
                  className="bg-cyan-500 hover:bg-cyan-400 transition-colors duration-300 text-white py-1 px-3 rounded shadow-xl"
                >
                  {isFetching ? (
                    <BarLoader color="white" className="my-2" />
                  ) : limit >= totalComments ? (
                    "No more comments"
                  ) : (
                    "See More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;

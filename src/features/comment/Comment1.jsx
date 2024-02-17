import moment from "moment";
import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { FaThumbsUp } from "react-icons/fa";
import { useEditCommentMutation } from "./commentApi";
import { toast } from "react-toastify";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [editComment] = useEditCommentMutation()
  const [editedComment, setEditedComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const {id: userId, isAdmin} = useAuth()
  console.log(userId)

  const handelEdit = async (id) => {
    try {
      const res = await editComment({
        id,
        content: editedComment
      })
      if (res.error){
        toast.error(res.error.data.message)
      } else {
        toast.success(res.data.message)
        setEditMode(false)
        setEditedComment("")
      }
    } catch (error) {
      console.log(error.message)
    }
  }


  return (
    <div>
      <div
        className="flex justify-start items-start gap-3 mt-5 w-full"
      >
        {/* PROFILE */}
        <div className="w-8 h-9 rounded-full overflow-hidden">
          <img
            className="w-full h-full rounded-full object-cover"
            src={comment.userId.profile}
            alt=""
          />
        </div>
        <div className="w-full">
          {/* USERNAME & DATE */}
          <div className="flex justify-start  items-center gap-4 text-sm">
            <span className="font-bold  ">{comment.userId.username}</span>
            <span className="text-xs">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          {/* CONTENT */}
          {editMode ? (
            <div className="my-2">
              <textarea
                className="w-full p-2 border  border-gray-400 rounded outline-none"
                cols="30"
                rows="2"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              ></textarea>
              <div className="flex justify-end items-center gap-3 mt-1">
                <button onClick={() => handelEdit(comment._id)} className="bg-cyan-500 text-white py-1 px-4 rounded shadow-md text-sm">
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-red-500 text-sm text-white py-1 px-3 rounded shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="text-sm">{comment.content}</span>
              <hr className="w-20 my-1" />
              {/* LIKE, EDIT & DELETE */}
              <div className="flex justify-start items-center gap-3 mb-1">
                <button
                  type="button"
                  onClick={() => onLike(comment._id)}
                  className={`text-gray-400 hover:text-blue-500 ${
                    userId &&
                    comment.likedBy.includes(userId) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-sm my-2" />
                </button>
                <p className="text-gray-400 text-sm">
                  {comment.likes > 0 &&
                    comment.likes +
                      " " +
                      (comment.likes === 1 ? "like" : "likes")}
                </p>
                {userId === comment.userId._id && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(true);
                      setEditedComment(comment.content);
                    }}
                    className="text-gray-400 hover:text-blue-500 text-sm"
                  >
                    Edit
                  </button>
                )}
                {(userId === comment.userId._id || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Comment;

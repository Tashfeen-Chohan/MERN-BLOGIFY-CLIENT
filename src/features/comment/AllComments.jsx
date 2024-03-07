import React, { useState } from "react";
import { useDeleteCommentMutation, useGetAllCommentsQuery } from "./commentApi";
import { BarLoader, BeatLoader, PropagateLoader } from "react-spinners";
import { MdDelete, MdOutlinePreview } from "react-icons/md";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AllComments = () => {
  const [sort, setSort] = useState("");
  const [pageNo, setPageNo] = useState(1);
  let url = `/comments?sortBy=${sort}&page=${pageNo}`;
  const { data, isLoading, isFetching } = useGetAllCommentsQuery(url);
  const [deleteComment] = useDeleteCommentMutation();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

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
    }
  };

  const { comments, totalComments, totalPages, page, limit } = data ?? {};
  console.log(comments);

  return (
    <div>
      <div className="w-[95%] md:max-w-5xl mx-auto">
        {/* TABLE */}
        <div className="flex justify-center items-center my-8 md:mb-0">
          <h2 className="text-xl md:text-2xl font-serif font-bold">
            All Comments
          </h2>
        </div>
        {/* SORTING */}
        <div className="flex justify-between items-center">
          <span className="bg-blue-900 text-sm text-white py-1 px-3 rounded shadow-xl">
            Total : {totalComments}
          </span>
          <select
            onChange={(e) => setSort(e.target.value)}
            className="outline-none py-1 px-2 bg-slate-200 text-black rounded shadow-md"
          >
            <option value="">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="likes">Likes</option>
          </select>
        </div>
        {/* TABLE & LOADING EFFECT */}
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0  z-10 flex items-center justify-center">
              <BeatLoader size={15} color="black" />
            </div>
          )}
          <table
            className={
              `${isFetching ? "filter blur-sm" : ""} min-w-full border-collapse block md:table mt-3 mb-5 shadow-xl`
            }
          >
            <thead className="block md:table-header-group bg-slate-300 text-black">
              <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
                <th className="p-2 text-sm font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  #
                </th>
                <th className="p-2 text-sm font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  Post
                </th>
                <th className="text-sm p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  Username
                </th>
                <th className="text-sm p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  Content
                </th>
                <th className="text-sm p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  Likes
                </th>
                <th className="text-sm p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  Date
                </th>
                <th className="text-sm p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group text-sm md:text-xs">
              {comments?.map((val, index) => (
                <tr
                  key={val._id}
                  className="userTable my-3 rounded shadow-md md:shadow-none border border-grey-500 md:border-none block md:table-row hover:bg-gray-200"
                >
                  <td className="p-1 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      #
                    </span>
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      Post
                    </span>
                    {val.postId.title}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      Username
                    </span>
                    {val.userId.username}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      Content
                    </span>
                    {val.content}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      Likes
                    </span>
                    {val.likes}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      Date
                    </span>
                    {moment(val.createdAt).fromNow()}
                  </td>
                  <td className="p-1 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      Actions
                    </span>
                    <button
                      onClick={() => navigate(`/posts/${val.postId.slug}`)}
                      className="mr-1"
                    >
                      <MdOutlinePreview
                        className="hover:scale-125 transition-all duration-300"
                        size={25}
                        color="blue"
                      />
                    </button>
                    <button onClick={() => handleDelete(val._id)}>
                      <MdDelete
                        className="hover:scale-125 transition-all duration-300"
                        size={25}
                        color="red"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-sm text-gray-700 ">
            Showing
            <span className="font-semibold text-gray-900 px-1">
              {totalComments !== 0 ? (page - 1) * limit + 1 : totalComments}
            </span>
            to
            <span className="font-semibold text-gray-900 px-1">
              {page * limit > totalComments ? totalComments : page * limit}
            </span>
            of
            <span className="font-semibold text-gray-900 px-1">
              {totalComments}
            </span>
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPageNo(1)}
              className={
                page > 2
                  ? "bg-slate-700 text-sm hover:bg-slate-900 transition-colors duration-300 text-white rounded-s px-3"
                  : "hidden"
              }
            >
              Page 1
            </button>
            <button
              disabled={page === 1}
              onClick={() => setPageNo(page - 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-black bg-slate-200  hover:bg-slate-300 transition-colors duration-300"
            >
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPageNo(page + 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-slate-700 border-0 border-s  rounded-e hover:bg-slate-900 transition-colors duration-300"
            >
              Next
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllComments;

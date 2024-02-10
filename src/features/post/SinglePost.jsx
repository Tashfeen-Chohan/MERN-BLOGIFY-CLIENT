import React from "react";
import { useDeletePostMutation, useGetSinglePostQuery } from "./postApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../user/userApi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import { BeatLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const SinglePost = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSinglePostQuery(id);
  const { data: author, isLoading: authorLoading } = useGetSingleUserQuery(data?.author._id);
  const [deletePost, {isLoading: deleteLoading}] = useDeletePostMutation()
  const {id : authorId} = useAuth()
  const navigate = useNavigate()

  const date = new Date(data?.createdAt)
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  if (isLoading || authorLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    )

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
          const response = await deletePost(id);
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
            navigate(-1)
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
        console.log(error)
      }
    };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] my-5 rounded-t shadow-sm  max-w-3xl pb-7">
        <img
          className="w-full rounded h-auto shadow-xl my-3"
          src={data?.blogImg}
          alt="Blog cover imgage"
        />
        <div className="flex justify-between items-center px-2">
          <div className="flex justify-center items-center gap-3">
            <img className="h-9 w-9 object-cover rounded-full text-xs" src={author?.capitalized.profile} alt="Profile" />
            <span className="italic">{author?.capitalized.username}</span>
          </div>
          <span className="italic">{formattedDate}</span>
        </div>
        {authorId === data?.author._id && <div className="flex justify-end items-center gap-3">
          <FaEdit onClick={() => navigate(`/posts/update/${data?._id}`)} size={25} color="orange"/>
          <MdDelete onClick={() => handleDelete(data?._id)} size={30} color="red"/>
        </div>}
        <div className="flex justify-center items-center gap-2 mt-3">
          {data?.categories.map((cat) => (
            <span className="px-2 py-1 rounded-full bg-slate-200 text-sm" key={cat._id}>{cat.name}</span>
          ))}
        </div>
        <h1 className="px-2 text-center text-2xl font-bold py-4 md:text-3xl">
          {data?.title}
        </h1>
        

        <div className="px-2 md:px-7" dangerouslySetInnerHTML={{__html: data?.content}}/>

        {/* <p className="">
          <span className="text-2xl md:text-3xl italic">
            {data?.content[0]}
          </span>
          {data?.content.slice(1)}
        </p> */}
      </div>
    </div>
  );
};

export default SinglePost;
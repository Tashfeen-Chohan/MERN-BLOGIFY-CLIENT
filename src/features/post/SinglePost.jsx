import React from "react";
import { useGetSinglePostQuery } from "./postApi";
import { useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../user/userApi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAuth from "../../hooks/useAuth";

const SinglePost = () => {
  const { id } = useParams();
  const { data } = useGetSinglePostQuery(id);
  const { data: author } = useGetSingleUserQuery(data?.author._id);
  const {id : authorId} = useAuth()

  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] my-5 rounded  max-w-3xl  shadow-md py-7 px-4 md:px-10">
        <img
          className="w-full rounded h-auto shadow-xl my-3"
          src={data?.blogImg}
          alt="Blog cover imgage"
        />
        <div className="flex justify-start items-start gap-2 flex-col md:flex-row md:justify-between md:items-start">
          <div className="flex justify-center items-center gap-3">
            <img className="h-9 w-9 object-cover rounded-full" src={author?.capitalized.profile} alt="" />
            <span>{author?.capitalized.username}</span>
          </div>
          <span>{data?.createdAt}</span>
        </div>
        {authorId === data?.author._id && <div className="flex justify-end items-center gap-3">
          <FaEdit size={25} color="orange"/>
          <MdDelete size={30} color="red"/>
        </div>}
        <h1 className="text-center text-2xl font-bold py-6 md:text-3xl">
          {data?.title}
        </h1>

        <p className="">
          <span className="text-2xl md:text-3xl italic">
            {data?.content[0]}
          </span>
          {data?.content.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default SinglePost;

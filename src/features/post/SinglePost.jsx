import React from "react";
import { useGetSinglePostQuery } from "./postApi";
import { useParams } from "react-router-dom";

const SinglePost = () => {
  const { id } = useParams();
  const { data } = useGetSinglePostQuery(id);
  console.log(data);

  return (
    <div className="flex justify-center items-center">
      <div className="w-[90%] my-10 rounded  max-w-3xl bg-slate-100 shadow-xl py-7 px-4 md:px-10">
        <h1 className="text-left md:text-center text-2xl font-bold md:pb-3 md:text-3xl">{data?.title}</h1>
        <div className="flex justify-start items-start flex-col md:flex-row md:justify-between md:items-start">
          <span>{data?.author.username}</span>
          <span>{data?.createdAt}</span>
        </div>
        <img
          className="w-full rounded h-auto shadow-xl my-5"
          src={data?.blogImg}
          alt="Blog cover imgage"
        />
        
        <p className="mt-7">
          <span className="text-2xl md:text-3xl italic">{data?.content[0]}</span>
          {data?.content.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default SinglePost;

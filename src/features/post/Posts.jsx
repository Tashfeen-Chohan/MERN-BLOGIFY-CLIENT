import React from "react";
import { useGetPostsQuery } from "./postApi";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const { data, isLoading } = useGetPostsQuery("/posts");
  const navigate = useNavigate()

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const Posts = data?.map((val) => {
    const date = new Date(val?.createdAt);
    const option = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", option);

    return (
      <div onClick={() => navigate(`posts/${val._id}`)} key={val._id} className="col-span-12 md:col-span-4 shadow-xl">
        {val.blogImg && (
          <img
            className="rounded-t-md rounded-b-sm"
            src={val.blogImg}
            alt="Blog cover photo"
          />
        )}
        <h2 className="font-bold text-2xl text-center my-3 line-clamp-2">{val.title}</h2>
        <p className="px-2 line-clamp-3">{val.content}</p>
        <div className="flex justify-start items-center gap-2 my-3 px-2">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={val.author.profile}
              alt="Author profile"
            />
          </div>
          <div className="flex justify-center items-start flex-col">
            <span className="text-sm italic">{val.author.username}</span>
            <span className="text-sm italic">{formattedDate}</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-12 gap-5 w-[95%] md:max-w-5xl my-7">{Posts}</div>
    </div>
  );
};

export default Posts;

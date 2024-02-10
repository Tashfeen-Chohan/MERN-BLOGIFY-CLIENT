import React, { useState } from "react";
import { useGetPostsQuery } from "./postApi";
import { BeatLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";

const Posts = () => {
  const [search, setSearch] = useState("")
  const [limit, setLimit] = useState(6)
  const postUrl = `/posts?searchBy=${search}&limit=${limit}`
  const { data, isLoading } = useGetPostsQuery(postUrl);
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const {posts, totalPosts} = data

  const Posts = posts?.map((val) => {
    const date = new Date(val.createdAt);
    const option = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", option);

    return (
      <div
        className="col-span-12 md:col-span-4 shadow-lg rounded hover:scale-105 transition-transform duration-300"
        onClick={() => navigate(`posts/single/${val._id}`)}
        key={val._id}
      >
        {val.blogImg && (
          <img
            className="rounded-t-md text-sm"
            src={val.blogImg}
            alt="Blog cover photo"
          />
        )}
        <div className="mt-3 flex justify-center items-center gap-2 flex-wrap px-2">
          {val.categories.map((cat) => (
            <span
              className="px-2 py-1 rounded-full bg-slate-200 text-xs"
              key={cat._id}
            >
              {cat.name}
            </span>
          ))}
        </div>
        <h2 className="font-bold text-2xl text-center my-3 line-clamp-2 px-2">
          {val.title}
        </h2>
        <p
          className="px-2 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: val.content }}
        />
        <div className="flex justify-start items-center gap-2 my-3 px-2">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover text-xs"
              src={val.author.profile}
              alt="Profile"
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
      <div >
        {/* HEADER */}
        <div className="my-10 p-3 flex justify-center items-center flex-col mx-auto rounded-lg w-[95%] md:max-w-xl shadow-xl">
          <Link className="text-sm" to={"/register"}>Get started with <span className="font-bold italic">Blogify</span></Link>
          <h2 className="text-2xl md:text-3xl font-bold">What are you looking up-to?</h2>
          <div className="flex md:w-full justify-center items-center gap-3 mt-2 rounded-lg py-2 px-3">
            <MdSearch color="gray" size={22}/>
            <input  className="md:w-[60%] py-1 px-2 outline-none border-b-2 focus-within:border-black" type="text" placeholder="Search any blog..." onChange={(e) => setSearch(e.target.value)} />
            <button className="bg-slate-700 hover:bg-slate-800 transition-colors duration-300 text-white rounded py-1 px-3">Search</button>
          </div>
        </div>
        {/* POSTS */}
        <div className="grid mx-auto grid-cols-12 gap-7 md:gap-x-5 md:gap-y-7 w-[95%] md:max-w-5xl my-7">
          {Posts}
        </div>
        {/* NO POST FOUND */}
        <div
          className={
            totalPosts === 0
              ? "block text-red-500 text-center font-bold mb-4 text-lg"
              : "hidden"
          }
        >
          <p>No post found!</p>
        </div>
        {/* PAGINATION */}
        {(totalPosts !== 0 && limit < totalPosts)  &&  <div className="my-5 flex justify-center items-center ">
          <button onClick={() => setLimit(limit + 6)} className="py-1 px-3 rounded shadow-xl bg-slate-700 text-white hover:bg-slate-800 transition-colors duration-300" >See More</button>
        </div>}
      </div>
    </div>
  );
};

export default Posts;

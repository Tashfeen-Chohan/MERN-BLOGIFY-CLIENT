import React, { useState } from "react";
import { useGetPostsQuery } from "./postApi";
import { BarLoader, BeatLoader, PulseLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { PiHandsClappingFill, PiHandsClappingLight } from "react-icons/pi";
import { FaFilter, FaRegComment, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCategory,
  resetPublisher,
  selectCategory,
  selectPublisher,
} from "../../app/dataSlice";
import moment from "moment";
import useAuth from "../../hooks/useAuth";

const Posts = () => {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(6);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");
  const publisher = useSelector(selectPublisher);
  const category = useSelector(selectCategory);
  const postUrl = `/posts?searchBy=${search}&sortBy=${sort}&filterBy=${filter}&authorId=${publisher.id}&categoryId=${category.id}&limit=${limit}`;
  const { data, isLoading, isFetching } = useGetPostsQuery(postUrl);
  const { id: userId } = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const removeCategoryFilter = () => {
    dispatch(resetCategory());
  };

  const removePublisherFilter = () => {
    dispatch(resetPublisher());
  };

  const { posts, totalPosts } = data ?? {};

  const Posts = posts?.map((val) => {
    const viewPost = () => {
      navigate(`posts/${val.slug}`);
      window.scrollTo(0, 0);
    };

    return (
      <div
        className="col-span-12 md:col-span-4 shadow-lg rounded hover:scale-105 transition-transform duration-300"
        key={val._id}
      >
        {/* BLOG COVER IMG */}
        <div onClick={viewPost} className="relative">
          {val.popular && (
            <div className="bg-rose-500 text-gray-100 absolute top-3 text-sm right-2 px-3 py-1 rounded">
              Popular
            </div>
          )}
          {val.blogImg && (
            <img
              className="rounded-t-md text-sm"
              src={val.blogImg}
              alt="Blog cover photo"
              loading="lazy"
            />
          )}
        </div>

        {/* AUTHOR INFO */}
        <div className="flex justify-between items-center mt-2 px-2">
          <div
            onClick={() => navigate(`/users/${val.author.slug}`)}
            className="cursor-pointer flex justify-center items-center gap-2"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img
                className="h-full w-full object-cover text-xs"
                src={val.author.profile}
                alt="Profile"
              />
            </div>

            <span className="text-xs italic">{val.author.username}</span>
          </div>
          <div className="text-xs italic flex justify-center items-center">
            <span>{(val.content.length / 1000).toFixed(0)} mins read</span>
            <span className="px-1"> - </span>
            <span className="text-xs italic">
              {moment(val.createdAt).fromNow()}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h2
          onClick={viewPost}
          className="font-bold text-xl text-center my-3 line-clamp-2 px-2"
        >
          {val.title}
        </h2>

        {/* CONTENT */}
        <p
          onClick={viewPost}
          className="px-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: val.content }}
        />

        {/* CATEGORIES */}
        <div className="mt-3 flex justify-center items-center gap-2 flex-wrap px-2">
          {val.categories.map((cat) => (
            <span
              className="cursor-pointer hover:scale-110 transition-all duration-300 px-2 py-1 rounded-full bg-slate-200 text-xs"
              key={cat._id}
              onClick={() => navigate(`categories/${cat.slug}`)}
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* LIKES, COMMENTS, VIEWS */}
        <div
          onClick={viewPost}
          className="my-4 flex justify-start items-center gap-4 px-2"
        >
          <span className="flex justify-center items-center gap-1 text-sm">
            {userId && val?.likedBy.includes(userId) ? (
              <PiHandsClappingFill size={21} />
            ) : (
              <PiHandsClappingLight size={21} />
            )}
            {val?.likes}
          </span>
          <span className="flex justify-center items-center gap-1 text-sm">
            <FaRegComment size={20} />
            {val.commentsCount}
          </span>
          <span className="flex justify-center items-center gap-1 text-sm">
            <FaRegEye size={20} />
            {val.views}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className="flex justify-center items-center">
      <div>
        {/* HEADER */}
        <div className="bg-slate-50 shadow-md my-10 py-2 md:py-4 flex justify-center items-center flex-col mx-auto rounded-lg w-[94%] md:max-w-xl ">
          <Link className="text-sm" to={"/register"}>
            Get started with <span className="font-bold italic">Blogify</span>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold">
            What are you looking up-to?
          </h2>
          <div className="flex md:w-full justify-center items-center gap-2 mt-2 rounded-lg py-2 px-5">
            <MdSearch color="gray" size={26} />
            <input
              className="md:w-[60%] w-[80%] py-1 px-2 outline-none border-b border-black focus-within:border-b-2"
              type="text"
              placeholder="Search any blog..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-blue-900 hover:bg-blue-700 transition-colors duration-300 text-white rounded py-1 px-3">
              Search
            </button>
          </div>
        </div>
        {/* FILTER && SORT */}
        <div className="w-[94%] mx-auto">
          <div className="flex justify-between items-center mt-3">
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-200 shadow-md text-sm font-semibold  rounded text-black outline-none px-2 py-1"
            >
              <option value="">All Posts {!filter && `(${totalPosts})`}</option>
              <option value="popular">
                Popular {filter && `(${totalPosts})`}
              </option>
            </select>
            <select
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-200 shadow-md text-sm font-semibold   rounded text-black outline-none px-2 py-1"
            >
              <option value="">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="views">Views </option>
              <option value="likes">Likes </option>
              <option value="title">A to Z &#8595;</option>
              <option value="title desc">Z to A &#8593;</option>
            </select>
          </div>
        </div>
        {/* PUBLISHER & CATEGORY FILTER */}
        {(category.name || publisher.name) && (
          <div className="w-[90%] md:max-w-md mx-auto bg-slate-100 p-5 rounded shadow-md mt-5">
            <span className="relative">
              <span className=" flex justify-start items-center gap-2">
                <FaFilter />
                Filters
              </span>
              <span className="absolute -top-1 left-[70px] bg-blue-900 rounded-full text-white w-4 h-4 flex justify-center items-center text-xs">
                {category.name && publisher.name ? 2 : 1}
              </span>
            </span>
            <div className="flex justify-center items-center gap-3 mt-3">
              {publisher.name && (
                <span
                  onClick={removePublisherFilter}
                  className="bg-blue-900 hover:bg-blue-800 transition-colors duration-300 text-gray-200  py-0.5 px-3 rounded-full "
                >
                  <span className="text-xs">{publisher.name}</span>
                  <span className="text-sm ml-2 font-bold">x</span>
                </span>
              )}
              {category.name && (
                <span
                  onClick={removeCategoryFilter}
                  className="bg-blue-900 hover:bg-blue-800 transition-colors duration-300 text-gray-200 py-0.5 px-3 rounded-full "
                >
                  <span className="text-xs">{category.name}</span>
                  <span className="text-sm ml-2 font-bold">x</span>
                </span>
              )}
            </div>
          </div>
        )}
        {/* POSTS */}
        <div className="relative w-[94%] mx-auto md:max-w-6xl">
          {isFetching && (
            <div className="absolute inset-0  z-10 flex items-center justify-center">
              <BeatLoader size={18} />
            </div>
          )}
          <div
            className={`${
              isFetching ? "filter blur-sm" : ""
            } grid mx-auto grid-cols-12 gap-7 md:gap-x-5 md:gap-y-7 my-7`}
          >
            {Posts}
          </div>
        </div>
        {/* NO POST FOUND */}
        <div
          className={
            totalPosts === 0
              ? "block w-[94%] md:w-[64rem] text-red-500 text-center font-bold mb-4 text-lg"
              : "hidden"
          }
        >
          <p>No post found!</p>
        </div>
        {/* PAGINATION */}
        {totalPosts !== 0 && (
          <div className="my-5 flex justify-center items-center ">
            <button
              disabled={limit >= totalPosts}
              onClick={() => setLimit(limit + 6)}
              className="py-1 px-3 rounded shadow-xl bg-blue-900 text-white hover:bg-blue-700 transition-colors duration-300"
            >
              {isFetching ? (
                <BarLoader color="white" size={7} className="my-2 " />
              ) : limit >= totalPosts ? (
                "No More Posts"
              ) : (
                "See More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;

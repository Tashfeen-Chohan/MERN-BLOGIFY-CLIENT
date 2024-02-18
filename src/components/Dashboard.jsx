import React, { useState } from "react";
import { useGetUsersQuery } from "../features/user/userApi";
import { TbUsersGroup } from "react-icons/tb";
import { RiArticleLine } from "react-icons/ri";
import {
  useGetPostsQuery,
  useGetTotalLikesAndViewsQuery,
} from "../features/post/postApi";
import { BeatLoader } from "react-spinners";
import { LiaComments } from "react-icons/lia";
import { useGetAllCommentsQuery } from "../features/comment/commentApi";
import { useGetCategoriesQuery } from "../features/category/categoryApi";
import { BiCategoryAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdOutlinePreview } from "react-icons/md";
import { PiHandsClappingFill, PiHandsClappingLight } from "react-icons/pi";
import moment from "moment";
import { FaRegComment, FaRegEye } from "react-icons/fa";

const Dashboard = () => {
  const { data: Users, isLoading } = useGetUsersQuery("/users");
  const { data: Posts, isLoading: postLoading } = useGetPostsQuery("/posts");
  const { data: Comments, isLoading: comLoading } =
    useGetAllCommentsQuery("/comments");
  const { data: Categories, isLoading: catLoading } =
    useGetCategoriesQuery("/categories");
  const { data, isLoading: totalLoading } =
    useGetTotalLikesAndViewsQuery("/posts/likes-views");
  const { data: allComments, allComLoading } =
    useGetAllCommentsQuery("/comments");

  const [limit, setLimit] = useState(3);
  const [sort, setSort] = useState("");
  let url = `posts?filterBy=popular&sortBy=${sort}&limit=${limit}`;
  const { data: Popular, isLoading: popularLoading } = useGetPostsQuery(url);

  const navigate = useNavigate();

  if (isLoading || postLoading || comLoading || catLoading || totalLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const viewPost = (id) => {
    navigate(`/posts/single/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {/* STATS */}
      <div className="w-[95%] md:max-w-3xl mx-auto grid grid-cols-12 gap-3 md:gap-4 mt-10">
        {/* USERS */}
        <div
          onClick={() => navigate("/users")}
          className="hover:scale-110 hover:bg-purple-600 transition-all duration-300 col-span-6 md:col-span-4 py-4 md:py-5 shadow-xl rounded bg-purple-500 text-gray-100 flex justify-between md:justify-center md:gap-5 px-3 items-center "
        >
          <TbUsersGroup size={50} />
          <div className="flex justify-center items-center flex-col">
            <p className="text-xl font-bold">{Users?.totalUsers}</p>
            <p>Users</p>
          </div>
        </div>
        {/* POSTS */}
        <div
          onClick={() => navigate("/")}
          className="hover:scale-110 hover:bg-sky-600 transition-all duration-300 col-span-6 md:col-span-4 py-4 shadow-xl rounded bg-sky-500 text-gray-100 flex justify-between md:justify-center md:gap-5 px-3 items-center "
        >
          <RiArticleLine size={50} />
          <div className="flex justify-center items-center flex-col">
            <p className="text-xl font-bold">{Posts?.totalPosts}</p>
            <p>Posts</p>
          </div>
        </div>
        {/* COMMENTS */}
        <div
          onClick={() => navigate("/all-comments")}
          className="hover:scale-110 hover:bg-yellow-400 transition-all duration-300 col-span-6 md:col-span-4 py-4 shadow-xl rounded bg-yellow-500 text-gray-100 flex md:justify-center justify-between items-center px-3 md:gap-5"
        >
          <LiaComments size={50} />
          <div className="flex justify-center items-center flex-col">
            <p className="text-xl font-bold">{Comments?.length}</p>
            <p>Comments</p>
          </div>
        </div>
        {/* CATEGORIES */}
        <div
          onClick={() => navigate("/categories")}
          className="hover:scale-110 hover:bg-rose-600 transition-all duration-300 col-span-6 md:col-span-4 py-4 shadow-xl rounded bg-rose-500 text-gray-100 flex justify-center items-center gap-5"
        >
          <BiCategoryAlt size={50} />
          <div className="flex justify-center items-center flex-col">
            <p className="text-xl font-bold">{Categories?.totalCategories}</p>
            <p>Categories</p>
          </div>
        </div>
        {/* VIEWS */}
        <div className="hover:scale-110 hover:bg-green-600 bg-green-500 text-gray-100 transition-all duration-300 col-span-6 md:col-span-4 py-4 shadow-xl rounded flex md:justify-center justify-between  items-center px-3 md:gap-5">
          <MdOutlinePreview size={50} />
          <div className="flex justify-center items-center flex-col">
            <p className="text-xl font-bold">{data?.totalViews}</p>
            <p>Views</p>
          </div>
        </div>
        {/* LIKES */}
        <div className="hover:scale-110 hover:bg-indigo-600 bg-indigo-500 text-gray-100 transition-all duration-300 col-span-6 md:col-span-4 py-4 md:py-5 shadow-xl rounded flex justify-between md:justify-center md:gap-5 px-3 items-center ">
          <PiHandsClappingFill size={50} />
          <div className="flex justify-center items-center flex-col">
            <p className="text-xl font-bold">{data?.totalLikes}</p>
            <p>Likes</p>
          </div>
        </div>
      </div>

      {/* TOP ARTICLE & RECENT COMMENT*/}
      {popularLoading ? (
        <div className="w-[95%] flex justify-center items-center my-7">
          <BeatLoader color="#000000" size={15} />
        </div>
      ) : (
        <div className="w-[95%] flex flex-col md:flex-row mx-auto my-7 md:my-10 md:max-w-4xl gap-7">
          {/* TOP ARTICLE */}
          <div className="md:w-[60%]">
            {/* HEADING & SORTING */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold font-serif">Top Articles</h2>
              <select
                onChange={(e) => setSort(e.target.value)}
                className="outline-none py-1 px-3 border-b-2 shadow-sm"
              >
                <option value="">Recent</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            {/* ARTICLES */}
            <div>
              {Popular?.posts.map((post) => (
                <div
                  className="hover:bg-gray-100 pt-3 mt-4 shadow px-1 md:px-5"
                  key={post._id}
                >
                  <div className="flex justify-start items-start  gap-3">
                    <img
                      onClick={() => viewPost(post._id)}
                      src={post.blogImg}
                      className="cursor-pointer w-16 h-16 md:h-24 md:w-24 rounded object-cover"
                      alt=""
                    />
                    {/* POST INFO */}
                    <div>
                      <h2
                        onClick={() => viewPost(post._id)}
                        className="cursor-pointer font-bold line-clamp-2"
                      >
                        {post.title}
                      </h2>
                      <div>
                        <span>{moment(post.createdAt).fromNow()}</span>
                        <span className="mx-3"> - </span>
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/users/single/${post.author._id}`)
                          }
                        >
                          {post.author.username}
                        </span>
                      </div>
                      <div className="flex justify-start items-center gap-3 mt-1.5">
                        <div className="flex justify-start items-center gap-1">
                          <PiHandsClappingLight />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex justify-start items-center gap-1">
                          <FaRegComment />
                          <span className="text-sm">{post.commentsCount}</span>
                        </div>
                        <div className="flex justify-start items-center gap-1">
                          <FaRegEye />
                          <span className="text-sm">{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-2 shadow-xl" />
                </div>
              ))}
              {/* SEE MORE BUTTON */}
              {limit < Popular?.totalPosts && (
                <div
                  onClick={() => setLimit(limit + 3)}
                  className="flex justify-center items-center mt-3"
                >
                  <button className="hover:bg-cyan-400 transition-colors duration-300 bg-cyan-500 text-white py-1 px-3 rounded shadow-xl">
                    See More
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* RECENT COMMENTS */}
          <div className="md:w-[50%]">
            {/* HEADING */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold font-serif">Recent Comments</h2>
              <button className="bg-cyan-500 text-white hover:bg-cyan-400 transition-colors duration-300 py-1 px-3 rounded shadow-xl">
                See All
              </button>
            </div>
            {/* COMMENTS */}
            <div className="relative overflow-x-auto md:w-full shadow-md sm:rounded mb-5 mt-3 w-[100%]">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-md text-black uppercase bg-slate-300">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      CONTENT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      LIKES
                    </th>
                  </tr>
                </thead>
                <tbody className="font-semibold! text-sm">
                  {allComments?.map((val, index) => (
                    <tr
                      key={val._id}
                      className="userTable bg-white border-b hover:bg-gray-200"
                    >
                      <td className="px-6 py-2">
                          {val.content}
                      </td>
                      <td className="px-6 py-2 text-right flex justify-start items-center gap-2">
                        {val.likes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import { useTotalUsersQuery } from "../features/user/userApi";
import { TbUsersGroup } from "react-icons/tb";
import { RiArticleLine } from "react-icons/ri";
import {
  useGetPostsQuery,
  useGetTotalLikesAndViewsQuery,
} from "../features/post/postApi";
import { BeatLoader } from "react-spinners";
import { LiaComments } from "react-icons/lia";
import { useGetAllCommentsQuery } from "../features/comment/commentApi";
import { useTotalCategoriesQuery } from "../features/category/categoryApi";
import { BiCategoryAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdOutlinePreview } from "react-icons/md";
import { PiHandsClappingFill, PiHandsClappingLight } from "react-icons/pi";
import moment from "moment";
import { FaLongArrowAltUp, FaRegComment, FaRegEye } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const Dashboard = () => {
  const [limit, setLimit] = useState(3);
  const [sort, setSort] = useState("");
  let url = `posts?filterBy=popular&sortBy=${sort}&limit=${limit}`;

  const { data: Users, isLoading } = useTotalUsersQuery();
  const { data: Posts, isLoading: postLoading } = useGetPostsQuery(url);
  const { data: Comments, isLoading: comLoading } =
    useGetAllCommentsQuery("/comments");
  const { data: Categories, isLoading: catLoading } = useTotalCategoriesQuery();

  // const { data, isLoading: totalLoading } =
  //   useGetTotalLikesAndViewsQuery("/posts/billo/likes-views");

  const [lastWeek, setLastWeek] = useState(true);
  const [lastMonth, setLastMonth] = useState(false);
  const navigate = useNavigate();

  if (isLoading || postLoading || comLoading || catLoading )
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
      {/* LAST WEEK & MONTH */}
      <div className="w-[95%] md:max-w-5xl flex justify-center items-center mt-7">
        <button
          onClick={() => {
            setLastWeek(true);
            setLastMonth(false);
          }}
          className={`${
            lastWeek ? "bg-blue-900 shadow-xl  text-white" : "bg-transparent"
          }  py-1 px-3 rounded-l border border-blue-900`}
        >
          Last Week
        </button>
        <button
          onClick={() => {
            setLastWeek(false);
            setLastMonth(true);
          }}
          className={`${
            lastMonth ? "bg-blue-900 shadow-xl  text-white" : "bg-transparent"
          }  py-1 px-3 rounded-r  border border-blue-900`}
        >
          Last Month
        </button>
      </div>
      {/* STATS */}
      <div
        className={`w-[95%] md:max-w-5xl mx-auto grid grid-cols-12 gap-3 md:gap-4 mt-7`}
      >
        {/* USERS */}
        <div
          onClick={() => navigate("/users")}
          className={`px-3 bg-gray-800 text-gray-100 hover:scale-110 hover:bg-gray-900 transition-all duration-300 col-span-6 md:col-span-3 py-3 shadow-xl rounded  `}
        >
          <div className="flex justify-between  items-start">
            <div className="flex justify-center items-start flex-col">
              <p>Users</p>
              <p className="text-xl font-bold">{Users?.total}</p>
            </div>
            <TbUsersGroup size={50} className="text-violet-500" />
          </div>
          <div className="text-sm flex justify-start items-center ml-[-3px] mt-1">
            <FaLongArrowAltUp className="text-green-400" />
            {lastWeek ? (
              <>
                <span>{Users?.lastWeek}</span>
                <span className="ml-1">Last Week</span>
              </>
            ) : (
              <>
                <span>{Users?.lastMonth}</span>
                <span className="ml-1">Last Month</span>
              </>
            )}
          </div>
        </div>
        {/* POSTS */}
        <div
          onClick={() => navigate("/")}
          className="text-sm px-3 bg-gray-800 text-gray-100 hover:scale-110 hover:bg-gray-900 transition-all duration-300 col-span-6 md:col-span-3 py-3 shadow-xl rounded"
        >
          <div className="flex justify-between items-start">
            <div className="flex justify-center items-start flex-col">
              <p>Posts</p>
              <p className="text-xl font-bold">{Posts?.allPosts}</p>
            </div>
            <RiArticleLine size={50} className="text-cyan-400" />
          </div>
          <div className="flex justify-start items-center ml-[-3px] mt-1">
            <FaLongArrowAltUp className="text-green-400" />
            {lastWeek ? (
              <>
                <span>{Posts?.lastWeekPosts}</span>
                <span className="ml-1">Last Week</span>
              </>
            ) : (
              <>
                <span>{Posts?.lastMonthPosts}</span>
                <span className="ml-1">Last Month</span>
              </>
            )}
          </div>
        </div>
        {/* COMMENTS */}
        <div
          onClick={() => navigate("/all-comments")}
          className="text-sm px-3 bg-gray-800 text-gray-100 hover:scale-110 hover:bg-gray-900 transition-all duration-300 col-span-6 md:col-span-3 py-3 shadow-xl rounded"
        >
          <div className="flex justify-between items-start">
            <div className="flex justify-center items-start flex-col">
              <p>Comments</p>
              <p className="text-xl font-bold">{Comments?.totalComments}</p>
            </div>
            <LiaComments size={50} className="text-yellow-400" />
          </div>
          <div className="flex justify-start items-center ml-[-3px] mt-1">
            <FaLongArrowAltUp className="text-green-400" />
            {lastWeek ? (
              <>
                <span>{Comments?.lastWeek}</span>
                <span className="ml-1">Last Week</span>
              </>
            ) : (
              <>
                <span>{Comments?.lastMonth}</span>
                <span className="ml-1">Last Month</span>
              </>
            )}
          </div>
        </div>
        {/* CATEGORIES */}
        <div
          onClick={() => navigate("/categories")}
          className="text-sm px-3 bg-gray-800 text-gray-100 hover:scale-110 hover:bg-gray-900 transition-all duration-300 col-span-6 md:col-span-3 py-3 shadow-xl rounded"
        >
          <div className="flex justify-between items-start">
            <div className="flex justify-center items-start flex-col">
              <p>Categories</p>
              <p className="text-xl font-bold">{Categories?.total}</p>
            </div>
            <BiCategoryAlt size={50} className="text-fuchsia-500" />
          </div>
          <div className="flex justify-start items-center ml-[-3px] mt-1">
            <FaLongArrowAltUp className="text-green-400" />
            {lastWeek ? (
              <>
                <span>{Categories?.lastWeek}</span>
                <span className="ml-1">Last Week</span>
              </>
            ) : (
              <>
                <span>{Categories?.lastMonth}</span>
                <span className="ml-1">Last Month</span>
              </>
            )}
          </div>
        </div>
        {/* VIEWS */}
        {/* <div className="text-sm px-3 bg-gray-800 text-gray-100 hover:scale-110 hover:bg-gray-900 transition-all duration-300 col-span-6 md:col-span-4 py-3 shadow-xl rounded">
          <div className="flex justify-between items-start">
            <div className="flex justify-center items-start flex-col">
              <p>Views</p>
              <p className="text-xl font-bold">{data?.totalViews}</p>
            </div>
            <MdOutlinePreview size={50} className="text-green-400" />
          </div>
          <div className="flex justify-start items-center ml-[-3px] mt-1">
            <FaLongArrowAltUp className="text-green-400" />
            {lastWeek ? (
              <>
                <span>{data?.lastWeekViews}</span>
                <span className="ml-1">Last Week</span>
              </>
            ) : (
              <>
                <span>{data?.lastMonthViews}</span>
                <span className="ml-1">Last Week</span>
              </>
            )}
          </div>
        </div> */}
        {/* LIKES */}
        {/* <div className="text-sm px-3 bg-gray-800 text-gray-100 hover:scale-110 hover:bg-gray-900 transition-all duration-300 col-span-6 md:col-span-4 py-3 shadow-xl rounded">
          <div className="flex justify-between items-start">
            <div className="flex justify-center items-start flex-col">
              <p>Likes</p>
              <p className="text-xl font-bold">{data?.totalLikes}</p>
            </div>
            <PiHandsClappingFill size={50} className="text-red-500" />
          </div>
          <div className="flex justify-start items-center ml-[-3px] mt-1">
            <FaLongArrowAltUp className="text-green-400" />
            {lastWeek ? (
              <>
                <span>{data?.lastWeekLikes}</span>
                <span className="ml-1">Last Week</span>
              </>
            ) : (
              <>
                <span>{data?.lastMonthLikes}</span>
                <span className="ml-1">Last Week</span>
              </>
            )}
          </div>
        </div> */}
      </div>

      {/* BAR CHART */}
      <div className="w-[95%] mx-auto md:max-w-5xl mt-10 flex justify-center items-center">
        <div className="w-[100%] md:w-[60%]">
        <Bar
          data={{
            labels: ["Posts", "Categories", "Users", "Comments"],
            datasets: [{
              label: "App Overview",
              data: [
                Posts?.allPosts,
                Categories?.total,
                Users?.total,
                Comments?.totalComments,
              ],
              backgroundColor: ["black", "red", "blue", "orange"],
            },
              
            ],
          }}
        />
        </div>
      </div>

      {/* TOP ARTICLE & RECENT COMMENT*/}
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
            {Posts?.posts.map((post) => (
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
            {limit < Posts?.totalPosts && (
              <div
                onClick={() => setLimit(limit + 3)}
                className="flex justify-center items-center mt-3"
              >
                <button className="hover:bg-blue-900 transition-colors duration-300 bg-blue-800 text-white py-1 px-3 rounded shadow-xl">
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
            <button
              onClick={() => navigate("/all-comments")}
              className="bg-blue-800 text-white hover:bg-blue-700 transition-colors duration-300 py-1 px-3 rounded shadow-xl"
            >
              See All
            </button>
          </div>
          {/* COMMENTS */}
          <div className="relative overflow-x-auto md:w-full shadow-md sm:rounded mb-5 mt-3 w-[100%]">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-md  uppercase bg-slate-700 text-white">
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
                {Comments?.comments.map((val, index) => (
                  <tr
                    key={val._id}
                    className="userTable bg-white border-b hover:bg-gray-200"
                  >
                    <td className="px-6 py-2">{val.content}</td>
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
    </div>
  );
};

export default Dashboard;

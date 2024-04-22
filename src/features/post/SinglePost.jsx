import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useGetSinglePostQuery,
  useLikePostMutation,
  useViewPostMutation,
} from "./postApi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaRegComment, FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import { BarLoader, BeatLoader, ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { PiHandsClappingFill, PiHandsClappingLight } from "react-icons/pi";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  PinterestShareButton,
  PinterestIcon,
  LinkedinIcon,
} from "react-share";
import Comment from "../comment/Comment";
import moment from "moment";
import { deleteObject, getStorage, ref } from "firebase/storage";
import app from "../../firebase";
import { Element, scroller } from "react-scroll";

const SinglePost = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetSinglePostQuery(slug);
  const [deletePost] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [viewPost] = useViewPostMutation();
  const [limit, setLimit] = useState(3);
  const [likeLoading, setLikeLoading] = useState(false);

  const { post, commentsCount } = data ?? {};

  const {
    data: recentPosts,
    isLoading: recentLoading,
    isFetching: recentFetching,
  } = useGetPostsQuery(
    post
      ? `/posts?authorId=${post?.author._id}&sortBy=views&limit=${limit}`
      : null
  );

  const { id: userId, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLiked, setIsLiked] = useState(false);

  const postURL = `https://tashfeen-blogify.vercel.app/posts/${slug}`;

  // HANDLE VIEW POST
  useEffect(() => {
    const handleView = async () => {
      try {
        if (!isLoading && post) {
          await viewPost(post._id);
        }
      } catch (error) {
        toast.error("Failed to view post");
        console.log(error.message);
      }
    };
    handleView();
  }, [slug, isLoading, viewPost]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const deleteBlogCover = async (fileRef) => {
    try {
      const storage = getStorage(app);
      const fileStorageRef = ref(storage, fileRef);
      await deleteObject(fileStorageRef);
    } catch (error) {
      toast.error("Error deleting file!");
      console.log(error.message);
    }
  };

  const handleDelete = async (id, blogImg) => {
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
        await deleteBlogCover(blogImg);
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
          navigate(-1);
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
      console.log(error);
    }
  };

  const handleLike = async (id) => {
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      setLikeLoading(true);
      const res = await likePost(id);
      toast.success(res.data.message);
      setIsLiked(true);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLikeLoading(false);
    }
  };

  // const {posts} = recentPosts;
  const RecentPosts = recentPosts?.posts?.map((val) => {
   
    const viewPost = async () => {
      navigate(`/posts/${val.slug}`);
      window.location.reload();
    };

    return (
      <div
        className=" col-span-12 md:col-span-4 shadow-lg rounded hover:scale-105 transition-transform duration-300"
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
            <span className="px-1 md:px-2"> - </span>
            <span className="text-xs italic">
              {moment(val.createdAt).fromNow()}
            </span>
          </div>
        </div>

        <h2
          onClick={viewPost}
          className="font-bold text-2xl text-center my-3 line-clamp-2 px-2"
        >
          {val.title}
        </h2>
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
              onClick={() => navigate(`/categories/${cat.slug}`)}
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* LIKES, COMMENTS & VIEWS */}
        <div
          onClick={viewPost}
          className="my-4 flex justify-start items-center gap-4 px-2 "
        >
          <span className="flex justify-center items-center gap-1 text-sm">
            <PiHandsClappingLight size={21} />
            {val.likes}
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
    <Element
      name="singlePost"
      className="flex justify-center items-center flex-col"
    >
      <div className="w-[95%] my-5 rounded-t shadow  max-w-4xl pb-7">
        <img
          className="w-full rounded h-auto shadow-xl my-3"
          src={post?.blogImg}
          alt="Blog cover imgage"
        />
        {/* AUTHOR INFO */}
        <div className="flex justify-between items-center px-2">
          <div
            onClick={() => navigate(`/users/${post?.author.slug}`)}
            className="flex justify-center items-center gap-3 cursor-pointer"
          >
            <img
              className="h-10 w-10 object-cover rounded-full text-xs"
              src={post?.author.profile}
              alt="Profile"
            />
            <span className="italic font-semibold text-xs md:text-sm">
              {post?.author.username}
            </span>
          </div>
          <div className="text-xs italic md:text-sm flex justify-center items-center">
            <span>{(post?.content.length / 1000).toFixed(0)} mins read</span>
            <span className="px-1"> - </span>
            <span className="italic">{moment(post?.createdAt).fromNow()}</span>
          </div>
        </div>

        {/* EDIT & DELETE */}
        <div className="flex justify-end items-center gap-3 mr-3">
          {userId === post?.author._id && (
            <FaEdit
              onClick={() => {
                navigate(`/posts/update/${post?.slug}`);
                window.scrollTo(0, 0);
              }}
              size={22}
              color="orange"
              className="hover:scale-125 transition-all duration-300"
            />
          )}
          {(userId === post?.author._id || isAdmin) && (
            <MdDelete
              onClick={() => handleDelete(post?._id, post?.blogImg)}
              size={25}
              color="red"
              className="hover:scale-125 transition-all duration-300"
            />
          )}
        </div>

        {/* CATEGORIES */}
        <div className="flex justify-center items-center flex-wrap gap-2 mt-3 md:mt-0">
          {post?.categories.map((cat) => (
            <span
              className="cursor-pointer hover:scale-110 transition-all duration-300 px-2 py-1 rounded-full bg-slate-200 text-sm"
              key={cat._id}
              onClick={() => navigate(`/categories/${cat.slug}`)}
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h1 className="px-2 text-center text-2xl font-bold py-5 md:text-3xl">
          {post?.title}
        </h1>

        <div
          className="px-2 md:px-20 post-content"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />

        {/* LIKES, COMMENTS & VIEWS */}
        <div className="cursor-pointer my-4 flex justify-start items-center gap-4 px-2 md:px-20">
          <span className="flex justify-center items-center gap-1 text-sm">
            {likeLoading ? (
              <ClipLoader size={15} />
            ) : userId && post?.likedBy.includes(userId) ? (
              <PiHandsClappingFill
                size={21}
                onClick={() => handleLike(post._id)}
              />
            ) : (
              <PiHandsClappingLight
                size={21}
                onClick={() => handleLike(post._id)}
              />
            )}
            {post?.likes}
          </span>
          <span className="flex justify-center items-center gap-1 text-sm">
            <FaRegComment size={20} />
            {commentsCount}
          </span>
          <span className="flex justify-center items-center gap-1 text-sm">
            <FaRegEye size={20} />
            {post?.views}
          </span>
        </div>

        {/* SOCIAL SHARE */}
        <div className="flex justify-end items-center px-5 md:px-20 gap-2">
          {/* Facebook Share Button */}
          <FacebookShareButton url={postURL} title={post?.title}>
            <FacebookIcon size={30} round />
          </FacebookShareButton>
          <WhatsappShareButton url={postURL} title={post?.title}>
            <WhatsappIcon size={30} round />
          </WhatsappShareButton>
          <TwitterShareButton url={postURL} title={post?.title}>
            <TwitterIcon size={30} round />
          </TwitterShareButton>
          <PinterestShareButton url={postURL} title={post?.title}>
            <PinterestIcon size={30} round />
          </PinterestShareButton>
          <LinkedinShareButton url={postURL} title={post?.title}>
            <LinkedinIcon size={30} round />
          </LinkedinShareButton>
        </div>

        {/* COMMENT SECTION */}
        <Comment postId={post._id} />
      </div>

      {/* RECENT ARTICLES */}
      <div className="w-[95%] mx-auto md:max-w-5xl">
        <h2 className="md:text-lg my-5 text-center">
          More from
          <span
            onClick={() => navigate(`/users/${post?.author.slug}`)}
            className="font-bold italic ml-2 cursor-pointer"
          >
            {post?.author.username}
          </span>
        </h2>
        <hr className="h-[2px] bg-gray-200" />
        {recentLoading ? (
          <div className="my-20 flex justify-center items-center">
            <BeatLoader />
          </div>
        ) : (
          <div className="grid mx-auto grid-cols-12 gap-7 md:gap-x-5 md:gap-y-7 my-7">
            {RecentPosts}
          </div>
        )}
        {recentPosts?.totalPosts > 3 && !recentLoading && (
          <div className="flex justify-center items-center mb-10">
            <button
              disabled={limit >= recentPosts?.totalPosts}
              onClick={() => setLimit(limit + 3)}
              className="disabled:bg-cyan-700 bg-cyan-500  hover:bg-cyan-400 transition-colors duration-300 px-3 py-1 text-white rounded shadow-xl mx-auto"
            >
              {recentFetching ? (
                <BarLoader color="white" size={7} className="my-2 " />
              ) : limit >= recentPosts?.totalPosts ? (
                "No More Posts"
              ) : (
                "See More"
              )}
            </button>
          </div>
        )}
      </div>
    </Element>
  );
};

export default SinglePost;

import React, { useEffect, useState } from "react";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useGetSinglePostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useViewPostMutation,
} from "./postApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../user/userApi";
import { FaEdit, FaFacebook, FaRegComment, FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import { BeatLoader } from "react-spinners";
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

const SinglePost = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSinglePostQuery(id);
  const { data: author, isLoading: authorLoading } = useGetSingleUserQuery(
    data?.author._id
  );
  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [viewPost] = useViewPostMutation();
  const {data: recentPosts} = useGetPostsQuery(`/posts?authorId=${data?.author._id}&limit=3`)

  const { id: userId } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const postURL = `http://localhost:3000/posts/${data?._id}`;

  // HANDLE VIEW POST
  useEffect(() => {
    const handleView = async () => {
      try {
        if (!isLoading && data) {
          await viewPost(data._id);
        }
      } catch (error) {
        toast.error("Failed to view post");
        console.log(error.message);
      }
    };
    handleView();
  }, [id, isLoading, viewPost]);

  // FORMATING DATE
  const date = new Date(data?.createdAt);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  if (isLoading || authorLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-200">
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
      const res = await likePost(id);
      toast.success(res.data.message);
      setIsLiked(true);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const handleUnlike = async (id) => {
    try {
      const res = await unlikePost(id);
      toast.success(res.data.message);
      setIsLiked(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const {posts} = recentPosts; 
  const RecentPosts = posts?.map((val) => {
    const date = new Date(val.createdAt);
    const option = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", option);

    return (
      <div
        className=" col-span-12 md:col-span-4 shadow-lg rounded hover:scale-105 transition-transform duration-300"
        onClick={() => {
          navigate(`/posts/single/${val._id}`)
          window.scrollTo(0,0)
        }}
        key={val._id}
      >
        <div className="relative">
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
        <div className="flex justify-between items-center mt-2 px-2">
          <div className="flex justify-center items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img
                className="h-full w-full object-cover text-xs"
                src={val.author.profile}
                alt="Profile"
              />
            </div>
            <span className="text-sm italic">{val.author.username}</span>
          </div>
          <div className="flex justify-center items-start flex-col">
            <span className="text-sm italic">{formattedDate}</span>
          </div>
        </div>
        
        <h2 className="font-bold text-2xl text-center my-3 line-clamp-2 px-2">
          {val.title}
        </h2>
        <p
          className="px-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: val.content }}
        />
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
        <div className="my-4 flex justify-start items-center gap-4 px-2 ">
          <span className="flex justify-center items-center gap-1 text-sm">
            <PiHandsClappingLight size={21} />
            {val.likes}
          </span>
          <span className="flex justify-center items-center gap-1 text-sm">
            <FaRegComment size={20} />
            {0}
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
    <div className="flex justify-center items-center flex-col">
      <div className="w-[95%] my-5 rounded-t shadow-md  max-w-3xl pb-7">
        <img
          className="w-full rounded h-auto shadow-xl my-3"
          src={data?.blogImg}
          alt="Blog cover imgage"
        />
        <div className="flex justify-between items-center px-2">
          <div className="flex justify-center items-center gap-3">
            <img
              className="h-10 w-10 object-cover rounded-full text-xs"
              src={author?.capitalized.profile}
              alt="Profile"
            />
            <span className="italic">{author?.capitalized.username}</span>
          </div>
          <span className="italic">{formattedDate}</span>
        </div>
        {userId === data?.author._id && (
          <div className="flex justify-end items-center gap-3">
            <FaEdit
              onClick={() => navigate(`/posts/update/${data?._id}`)}
              size={25}
              color="orange"
            />
            <MdDelete
              onClick={() => handleDelete(data?._id)}
              size={30}
              color="red"
            />
          </div>
        )}
        <div className="flex justify-center items-center gap-2 mt-3">
          {data?.categories.map((cat) => (
            <span
              className="px-2 py-1 rounded-full bg-slate-200 text-sm"
              key={cat._id}
            >
              {cat.name}
            </span>
          ))}
        </div>
        <h1 className="px-2 text-center text-2xl font-bold py-4 md:text-3xl">
          {data?.title}
        </h1>

        <div
          className="px-2 md:px-7"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        />
        {/* <p className="">
          <span className="text-2xl md:text-3xl italic">
            {data?.content[0]}
          </span>
          {data?.content.slice(1)}
        </p> */}

        {/* LIKES, COMMENTS & VIEWS */}
        <div className="my-4 flex justify-start items-center gap-4 px-2 md:px-7">
          <span className="flex justify-center items-center gap-1 text-sm">
            {isLiked ? (
              <PiHandsClappingFill
                size={21}
                onClick={() => handleUnlike(data?._id)}
              />
            ) : (
              <PiHandsClappingLight
                size={21}
                onClick={() => handleLike(data?._id)}
              />
            )}
            {data?.likes}
          </span>
          <span className="flex justify-center items-center gap-1 text-sm">
            <FaRegComment size={20} />
            {0}
          </span>
          <span className="flex justify-center items-center gap-1 text-sm">
            <FaRegEye size={20} />
            {data?.views}
          </span>
        </div>

        {/* SOCIAL SHARE */}
         <div className="flex justify-end items-center px-5 md:px-7 gap-2">
          {/* Facebook Share Button */}
          <FacebookShareButton url={postURL} title={data?.title}>
            <FacebookIcon size={30} round/>
          </FacebookShareButton>
          <WhatsappShareButton url={postURL} title={data?.title}>
            <WhatsappIcon size={30} round/>
          </WhatsappShareButton>
          <TwitterShareButton url={postURL} title={data?.title}>
            <TwitterIcon size={30} round/>
          </TwitterShareButton>
          <PinterestShareButton url={postURL} title={data?.title}>
            <PinterestIcon size={30} round/>
          </PinterestShareButton>
          <LinkedinShareButton url={postURL} title={data?.title}>
            <LinkedinIcon size={30} round/>
          </LinkedinShareButton>
        </div> 
      </div>

      {/* RECENT ARTICLES */}
      <div className="w-[95%] mx-auto md:max-w-5xl">
          
          <h2 className="md:text-lg my-5 text-center">More from <span className="font-bold italic">{author?.capitalized.username}</span> </h2>
          <hr className="h-[2px] bg-gray-200"/>
          <div className="grid mx-auto grid-cols-12 gap-7 md:gap-x-5 md:gap-y-7 my-7">
          {RecentPosts}
          </div>
      </div>
    </div>
  );
};

export default SinglePost;

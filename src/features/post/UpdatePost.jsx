import React, { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../category/categoryApi";
import Select from "react-select";
import { toast } from "react-toastify";
import { useGetSinglePostQuery, useUpdatePostMutation } from "./postApi";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";
import app from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FcEditImage } from "react-icons/fc";
import { PulseLoader } from "react-spinners";

const toolbarOptions = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    // [{size: []}],
    ["bold", "italic", "underline", "blockquote"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image", "video"],

    ["clean"],
  ],
};

const UpdatePost = () => {
  const { slug } = useParams();
  const catUrl = `categories?sortBy=name&limit=1000`;
  const { data } = useGetCategoriesQuery(catUrl);
  const { data: singlePost } = useGetSinglePostQuery(slug);
  const [updatePost] = useUpdatePostMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [blogImg, setBLogImg] = useState(undefined);
  const [prevBlogImg, setPrevBlogImg] = useState(undefined);
  const [showBlogImg, setShowBlogImg] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const { id } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (singlePost) {
      setTitle(singlePost.post.title);
      setContent(singlePost.post.content);
      setBLogImg(singlePost.post.blogImg);
      setPrevBlogImg(singlePost.post.blogImg);
      const selectedCategories = singlePost.post.categories.map((category) => ({
        value: category._id,
        label: category.name,
      }));
      setSelectedCategories(selectedCategories);
      setCategories(selectedCategories.map((category) => category.value));
    }
  }, [singlePost]);

  const options = data?.categories.map((val) => ({
    value: val._id,
    label: val.name,
  }));

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
    // Extracting only the 'value' (which is assumed to be 'id') and storing in the array
    setCategories(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleBlogCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBLogImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowBlogImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file) => {
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `BlogImages/${file.name + v4()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      toast.error("Error uploading file : ", error.message);
      console.log(error.message);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && content && categories.length > 0 && blogImg) {
      setLoading(true);
      try {
        if (showBlogImg) {
          var downloadURL = await uploadFile(blogImg);
          await deleteBlogCover(prevBlogImg);
        }
        const res = await updatePost({
          slug,
          author: id,
          title,
          content,
          categories,
          blogImg : showBlogImg ? downloadURL : blogImg,
        });
        if (res.error) {
          Swal.fire({
            title: "Error!",
            text: res.error.data.message,
            width: "27rem",
            customClass: {
              title: "!text-red-500 !font-bold",
              confirmButton:
                "!py-2 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
            },
          });
        } else {
          navigate(`/posts/${res.data.post.slug}`);
          window.scrollTo(0, 0);
          toast.success(res.data.message);
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An unexpected error occured on the server!",
          width: "27rem",
          customClass: {
            title: "!text-red-500 !font-bold",
            confirmButton:
              "!py-2 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          },
        });
        console.log(error.message);
      } finally {
        setLoading(false)
      }
    } else {
      toast.error("Please provide neccessary details!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="px-5 py-7 my-10 bg-slate-200 shadow-lg md:max-w-4xl w-[95%] rounded">
        <h1 className="text-center text-2xl md:text-3xl  font-bold pb-3">
          Update Post
        </h1>
        {/* IMAGE CONTAINER */}
        <div className="w-full mb-5">
          {showBlogImg ? (
            <img
              className="rounded shadow-lg w-full h-auto"
              src={showBlogImg}
              alt="Blog cover photo"
            />
          ) : (
            <img
              className="rounded shadow-lg w-full h-auto"
              src={blogImg}
              alt="Blog cover photo"
            />
          )}
          <div className="flex justify-end items-center mt-2 mr-2">
            <label htmlFor="editBlogCover">
              <FcEditImage size={25} />
            </label>
            <input
              type="file"
              id="editBlogCover"
              className="hidden"
              onChange={handleBlogCoverChange}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-3 shadow-md">
            <input
              className="w-full py-2 px-3 rounded text-2xl outline-none font-bold"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/* CONTENT */}
          <div className="mt-8 mb-5 h-80 md:h-72 bg-white">
            <ReactQuill
              className="bg-white rounded h-[71%] md:h-[85%]"
              modules={toolbarOptions}
              value={content}
              onChange={setContent}
            />
          </div>
          {/* CATEGORY */}
          <div className="flex gap-2 md:gap-5 justify-start  items-center flex-col md:flex-row">
            <Select
              className="w-full md:w-[50%] shadow-md"
              defaultValue={selectedCategories}
              value={selectedCategories}
              onChange={handleCategoryChange}
              options={options}
              isMulti
              isSearchable
              placeholder="Select categories"
              noOptionsMessage={() => "No Category Found!"}
            />
            {/* <input
              className="w-full md:w-[50%]"
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            /> */}
          </div>
          {/* SUBMIT */}
          <div className="md:mt-3 mt-4 flex justify-end items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 px-5 py-1 text-white rounded shadow-xl"
            >
              {loading ? <PulseLoader color="white" size={7}/> : "Update"}
            </button>
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="bg-rose-500 hover:bg-rose-600 transition-colors duration-300 px-3 py-1 text-white rounded shadow-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;

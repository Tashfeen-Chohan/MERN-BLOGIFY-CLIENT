import React, { useState } from "react";
import { useGetCategoriesQuery } from "../category/categoryApi";
import Select from "react-select";
import { toast } from "react-toastify";
import { useCreatePostMutation } from "./postApi";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RiChatDeleteFill } from "react-icons/ri";
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
    ["link"],

    ["clean"],
  ],
};

const CreatePost = () => {
  const catUrl = `categories?sortBy=name&limit=1000`;
  const { data } = useGetCategoriesQuery(catUrl);
  const [createPost] = useCreatePostMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [blogImg, setBlogImg] = useState(undefined);
  const [showBlogImg, setShowBlogImg] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const { id } = useAuth();
  const navigate = useNavigate();

  const options = data?.categories.map((val) => ({
    value: val._id,
    label: val.name,
  }));

  const handleCategoryChange = (selectedOptions) => {
    // Extracting only the 'value' (which is assumed to be 'id') and storing in the array
    setCategories(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogImg(file);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && content && categories.length > 0 && blogImg) {
      setLoading(true);
      const downloadURL = await uploadFile(blogImg);
      try {
        const res = await createPost({
          author: id,
          title,
          content,
          categories,
          blogImg: downloadURL,
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
          toast.success(res.data.message);
          navigate(`/posts/${res.data.post.slug}`);
          window.scrollTo(0, 0);
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
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please provide neccessary details!");
    }
  };

  const cancelCoverImg = () => {
    setBlogImg(undefined);
    setShowBlogImg(undefined);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="px-5 py-7 my-10 bg-slate-200 shadow-lg md:max-w-4xl w-[95%] rounded">
        <h1 className="text-center text-2xl md:text-3xl  font-bold pb-3">
          Create Post
        </h1>
        {/* IMAGE CONTAINER */}
        {blogImg && (
          <div className="w-full mb-3 relative">
            <img
              className="rounded shadow-lg w-full h-auto"
              src={showBlogImg}
              alt="Uploaded Image"
            />
            <div className="flex justify-end items-center gap-2 mt-1">
              <label htmlFor="editBlogCover">
                <FcEditImage className="text-orange-400" size={25} />
              </label>
              <input
                id="editBlogCover"
                type="file"
                className="hidden"
                onChange={handleCoverImgChange}
              />
              <RiChatDeleteFill
                onClick={cancelCoverImg}
                color="red"
                size={25}
              />
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-3">
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
          {/* CATEGORY & IMG */}
          <div className=" flex gap-2 md:gap-5 justify-start  items-center flex-col md:flex-row">
            <Select
              className="w-full md:w-[50%]"
              defaultValue={categories}
              onChange={handleCategoryChange}
              options={options}
              isMulti
              isSearchable
              placeholder="Select categories"
              noOptionsMessage={() => "No Category Found!"}
            />
            <input
              className="w-full md:w-[50%]"
              type="file"
              accept="image/*"
              onChange={handleCoverImgChange}
            />
          </div>
          {/* SUBMIT */}
          <div className="md:mt-3 mt-4 flex justify-end items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 disabled:bg-indigo-700 hover:bg-indigo-700 transition-colors duration-300 px-5 py-1 text-white rounded shadow-xl"
            >
              {loading ? <PulseLoader color="white" size={7} /> : "Publish"}
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

export default CreatePost;

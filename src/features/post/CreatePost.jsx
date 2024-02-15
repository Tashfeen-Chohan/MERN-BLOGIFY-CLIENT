import React, { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../category/categoryApi";
import Select from "react-select";
import { toast } from "react-toastify";
import { useCreatePostMutation } from "./postApi";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";
import app from "../../firebase";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaDeleteLeft } from "react-icons/fa6";

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

const CreatePost = () => {
  const catUrl = `categories?sortBy=name&limit=1000`;
  const { data } = useGetCategoriesQuery(catUrl);
  const [createPost] = useCreatePostMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [img, setImg] = useState(undefined);
  const [uploadedImg, setUploadedImg] = useState(undefined);
  const [isDisabled, setIsDisabled] = useState(false)
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

  const uploadFile = async (file) => {
    setIsDisabled(true)
    try {
    const storage = getStorage(app);
    const storageRef = ref(storage, `BlogImages/${file.name + v4()}`);
    const snapshot = await uploadBytes(storageRef, file);
    toast.success("Blog Cover uploaded successfully!");
    try {
      const downloadURL = await getDownloadURL(snapshot.ref);
      // console.log("DownloadURL - ", downloadURL);
      setUploadedImg(downloadURL);
      setIsDisabled(false)
    } catch (error) {
      toast.error("Error getting download URL : ", error.code);
    }
  } catch (error) {
    toast.error("Error uploading file : ", error);
    console.log(error.message)
  }
};

  useEffect(() => {
    if (img  && !uploadedImg) {
      uploadFile(img);
    }
  }, [img, uploadedImg]);

  useEffect(() => {
    if (uploadedImg) {
      setImg(uploadedImg);
    }
  }, [uploadedImg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((title, content, categories.length > 0)) {
      try {
        const res = await createPost({
          author: id,
          title,
          content,
          categories,
          blogImg: img,
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
          navigate(`/posts/single/${res.data.post._id}`);
          window.scrollTo(0,0)
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
      }
    } else {
      toast.error("Please provide neccessary details!");
    }
  };

  const cancelCoverImg = () => {
    setUploadedImg(undefined)
    setImg(undefined)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="px-5 py-7 my-10 bg-slate-200 shadow-lg md:max-w-4xl w-[95%] rounded">
        <h1 className="text-center text-2xl md:text-3xl  font-bold pb-3">
          Create Post
        </h1>
        {/* IMAGE CONTAINER */}
        {img && <div className="w-full mb-5 relative">
            <img
              className="rounded shadow-lg w-full h-auto"
              src={img}
              alt="Uploaded Image"
            />
          <FaDeleteLeft onClick={cancelCoverImg} className="absolute top-3 right-3 md:right-7 md:top-5" color="red" size={30}/>
        </div>}
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
              // formats={formats}
              value={content}
              onChange={setContent}
            />
          </div>
          {/* CATEGORY */}
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
              onChange={(e) => setImg(e.target.files[0])}
            />
          </div>
          {/* SUBMIT */}
          <div className="md:mt-3 mt-4 flex justify-end items-center gap-3">
            <button
              type="submit"
              disabled={isDisabled}
              className="bg-indigo-600 disabled:bg-indigo-400 hover:bg-indigo-700 transition-colors duration-300 px-5 py-1 text-white rounded shadow-xl"
            >
              Publish
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

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
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import app from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const {id: postId} = useParams()
  const catUrl = `categories?sortBy=name&limit=1000`;
  const { data } = useGetCategoriesQuery(catUrl);
  const {data: singlePost} = useGetSinglePostQuery(postId)
  const [updatePost] = useUpdatePostMutation()

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([])
  const [img, setImg] = useState(undefined);
  const [imgPercentage, setImgPercentage] = useState(0);
  const [uploadedImg, setUploadedImg] = useState(null);
  const { id } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (singlePost){
      setTitle(singlePost.post.title)
      setContent(singlePost.post.content)
      setImg(singlePost.post.blogImg)
      const selectedCategories = singlePost.post.categories.map(category => ({
        value: category._id,
        label: category.name
      }));
      setSelectedCategories(selectedCategories)
      setCategories(selectedCategories.map((category) => category.value))
    }
  }, [singlePost])

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

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `blogImages/${file.name + v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPercentage(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log(error);
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
          default:
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("DownloadURL - ", downloadURL);
          setUploadedImg(downloadURL);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((title, content, categories.length > 0)) {
      try {
        const res = await updatePost({
          id: postId,
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
          navigate(`/posts/single/${singlePost.post._id}`);
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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="px-5 py-7 my-10 bg-slate-200 shadow-lg md:max-w-4xl w-[95%] rounded">
        <h1 className="text-center text-2xl md:text-3xl  font-bold pb-3">
          Update Post
        </h1>
        {/* IMAGE CONTAINER */}
        <div className="w-full mb-5">
          {img && (
            <img
              className="rounded shadow-lg w-full h-auto"
              src={img}
              alt="Blog cover photo"
            />
          )}
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
              Update
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

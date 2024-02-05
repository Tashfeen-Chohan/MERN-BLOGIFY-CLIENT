import React, { useState } from "react";
import { useGetCategoriesQuery } from "../category/categoryApi";
import Select from "react-select";
import { toast } from "react-toastify";
import { useCreatePostMutation } from "./postApi";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const CreatePost = () => {
  const catUrl = `categories?sortBy=name&limit=1000`;
  const postUrl = `posts`;
  const { data } = useGetCategoriesQuery(catUrl);
  const [createPost] = useCreatePostMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [cover, setCover] = useState("");
  const { id } = useAuth();
  const author = id;

  const options = data?.capitalized.map((val) => ({
    value: val._id,
    label: val.name,
  }));

  const handleCategoryChange = (selectedOptions) => {
    // Extracting only the 'value' (which is assumed to be 'id') and storing in the array
    setCategories(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((title, content, categories.length > 0)) {
      try {
        const res = await createPost({
          author,
          title,
          content,
          categories,
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
    <div className="flex justify-center items-center min-h-screen mt-[-60px]">
      <div className="px-5 py-7 bg-slate-100 shadow-lg md:max-w-3xl w-[85%] rounded">
        <h1 className="text-center text-2xl md:text-3xl  font-bold pb-7">
          Create Post
        </h1>
        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="mb-3">
            <input
              className="w-full py-2 px-3 rounded text-xl outline-none"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/* CONTETN */}
          <div className="mb-3">
            <textarea
              className="h-52 w-full py-2 px-3 rounded text-lg outline-none"
              placeholder="Post description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          {/* CATEGORY */}
          <div className="flex gap-2 md:gap-5 justify-start  items-center flex-col md:flex-row">
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
            <input className="w-full md:w-[50%]" type="file" />
          </div>
          {/* SUBMIT */}
          <div className="md:mt-3 mt-4 flex justify-end items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 px-5 py-1 text-white rounded shadow-xl"
            >
              Publish
            </button>
            <button className="bg-rose-500 hover:bg-rose-600 transition-colors duration-300 px-3 py-1 text-white rounded shadow-xl">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

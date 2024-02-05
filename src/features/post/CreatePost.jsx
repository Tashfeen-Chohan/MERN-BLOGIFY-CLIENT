import React, { useState } from "react";
import { useGetCategoriesQuery } from "../category/categoryApi";
import Select from "react-select";
import { toast } from "react-toastify";

const CreatePost = () => {
  const url = `categories?sortBy=name&limit=1000`;
  const { data } = useGetCategoriesQuery(url);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState("");


  const options = data?.capitalized.map((val) => ({
    value: val.name,
    label: val.name,
  }));

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title, desc, selectedCategories.length > 0){
      try {
        
      } catch (error) {
        
      }
    } else {
      toast.error("Please provide neccessary details!")
    }
  }

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
          {/* DESCRIPTION */}
          <div className="mb-3">
            <textarea
              className="h-52 w-full py-2 px-3 rounded text-lg outline-none"
              placeholder="Post description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>
          {/* CATEGORY */}
          <div className="flex gap-2 md:gap-5 justify-start  items-center flex-col md:flex-row">
            <Select
              className="w-full md:w-[50%]"
              defaultValue={selectedCategories}
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
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 px-5 py-1 text-white rounded shadow-xl">
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

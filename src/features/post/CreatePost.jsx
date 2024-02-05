import React, { useState } from "react";
import { useGetCategoriesQuery } from "../category/categoryApi";
import Select from "react-select";

const CreatePost = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const url = `categories?sortBy=name&limit=1000`;
  const { data } = useGetCategoriesQuery(url);

  const options = data?.capitalized.map((val) => ({
    value: val.name,
    label: val.name
  }));

  return (
    <div className="flex justify-center items-center min-h-screen mt-[-60px]">
      <div className="px-5 py-7 bg-slate-100 shadow-lg md:max-w-3xl w-[85%] rounded">
        <h1 className="text-center text-2xl md:text-3xl  font-bold pb-7">
          Create Post
        </h1>
        <form>
          {/* TITLE */}
          <div className="mb-3">
            <input
              className="w-full py-2 px-3 rounded text-xl outline-none"
              type="text"
              placeholder="Title"
            />
          </div>
          {/* DESCRIPTION */}
          <div className="mb-3">
            <textarea
              className="h-52 w-full py-2 px-3 rounded text-lg outline-none"
              placeholder="Post description"
            ></textarea>
          </div>
          {/* CATEGORY */}
          <div className="flex gap-2 md:gap-5 justify-start  items-center flex-col md:flex-row">
           
            <Select
            className="w-full md:w-[50%]"
              defaultValue={selectedOption}
              onChange={setSelectedOption}
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
            <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 px-5 py-1 text-white rounded shadow-xl">
              Post
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

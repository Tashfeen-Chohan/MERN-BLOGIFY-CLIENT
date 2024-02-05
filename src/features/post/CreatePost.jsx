import React from "react";

const CreatePost = () => {
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
          <div>
            <select className="bg-slate-200 px-3 py-2 rounded mb-3">
              <option value="">Select a category</option>
            </select>
            <input className="md:ml-5" type="file" />
          </div>
          <div className="mt-3 flex justify-end items-center gap-3">
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

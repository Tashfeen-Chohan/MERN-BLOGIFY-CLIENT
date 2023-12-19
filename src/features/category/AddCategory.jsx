import React, { useState } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { Link } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const handleSubmit = () => {};
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="shadow-xl rounded p-10 w-[90%] md:max-w-lg">
        <h1 className="font-bold text-3xl text-center pb-10">Add Category</h1>
        <form onSubmit={handleSubmit} className="w-full md:w-[70%] md:mx-auto">
          <div className="flex justify-center items-center gap-6 mb-4">
            <label htmlFor="category" className="text-2xl font-bold">
              <BiSolidCategory />
              {/* Name */}
            </label>
            <input
              className="md:w-full border-b-2 text-lg px-1 border-gray-500 outline-none focus:border-black"
              type="text"
              placeholder="Category Name"
              name="category"
              id="category"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* ADD CATEGORY BUTTON */}
          <div className="mt-7 flex justify-end items-center gap-3">
            <button
              type="submit"
              className="py-1 px-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-500 text-white rounded shadow-xl"
            >
              Add
            </button>
            <Link to={"/categories"}>
              <button
                onClick={() => setName("")}
                className="bg-[#FE0000] hover:bg-red-600 transition-colors duration-500 text-white py-1 px-3 rounded shadow-xl"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;

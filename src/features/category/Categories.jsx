import React from "react";
import { useGetCategoriesQuery } from "./categoryApi";

const Categories = () => {
  const {
    data: categoires,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();

  if (isLoading) return <p>Loading....</p>;
  if (isError) return <p>{error}</p>;

  return (
    <div>
      <div className="py-5 flex justify-center items-center flex-col max-w-[90%] mx-auto rounded shadow-lg my-10 bg-slate-100 md:max-w-lg">
        <h1 className="text-3xl font-bold pb-4 text-center md:pb-7">
          BLOGIFY APP
        </h1>
        <div className="flex justify-center items-center gap-4 w-full px-4 md:pb-2">
          <input
            className="shadow-lg border-b-2 px-1 w-[75%] py-[2px] md:w-[50%]  outline-none focus:border-b-2 focus:border-black"
            type="text"
            placeholder="Search any category..."
          />
          <button className="bg-slate-800 text-white rounded py-1 px-3 shadow-xl hover:bg-slate-700">
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col">
        <h1 className="text-2xl font-bold ">All Categories</h1>
        {/* MAIN TABLE */}
      </div>
    </div>
  );
};

export default Categories;

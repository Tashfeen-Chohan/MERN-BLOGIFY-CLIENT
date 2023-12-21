import React, { useEffect, useState } from "react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "./categoryApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();

  const [deleteCategory] = useDeleteCategoryMutation();
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id);
      console.log(response);
      if (response.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("An error occured while deleting Category");
      console.log("Error deleting category");
    }
  };

  if (isLoading) return <p>Loading....</p>;
  if (isError) return <p>{error}</p>;

  const filterCategories = categories.filter((category) => {
    if (search.length === 0) {
      return category;
    } else {
      return category.name.toLowerCase().includes(search.toLowerCase());
    }
  });

  return (
    <div>
      <div className="py-5 flex justify-center items-center flex-col max-w-[90%] mx-auto rounded shadow-lg my-10 bg-slate-100 md:max-w-lg">
        <h1 className="text-3xl font-bold pb-4 text-center md:pb-7">
          BLOGIFY APP
        </h1>
        <div className="flex justify-center items-center gap-4 w-full px-4 md:pb-2">
          <input
            className="shadow-lg border-b-2 border-slate-400 px-2 w-[75%] py-[2px] md:w-[50%]  outline-none focus:border-b-2 focus:border-black"
            type="text"
            placeholder="Search any category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-slate-800 text-white rounded py-1 px-3 shadow-xl hover:bg-slate-700 transition-colors duration-500">
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col md:max-w-3xl mx-auto">
        {/* Add Category Container */}
        <div className="flex justify-between items-center w-[90%] md:w-full mb-3 md:mb-0">
          <span className="bg-slate-800 transition-colors duration-500 hover:bg-slate-700 py-1 px-3 text-white rounded shadow-xl">
            Total : {filterCategories.length}
          </span>
          <Link to={`/categories/new`}>
            <button className="py-1 px-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-500 text-white rounded shadow-xl">
              Add Category
            </button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold ">All Categories</h1>
        {/* MAIN TABLE */}
        <div className="relative overflow-x-auto w-[90%] md:w-full shadow-md sm:rounded my-5">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-md text-gray-700 uppercase bg-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filterCategories.map((val, index) => (
                <tr
                  key={val._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold">{index + 1}</td>
                  <td className="px-6 py-4 font-bold">{val.name}</td>
                  <td className="px-6 py-4 text-right flex justify-start items-center gap-2">
                    <Link to={`/categories/${val._id}`}>
                      <button className="bg-[#FFC436] hover:bg-[#FFA732] transition-colors duration-500 py-1 px-3 rounded shadow-xl">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(val._id)}
                      className="bg-[#FE0000] hover:bg-red-600 transition-colors duration-500 text-white py-1 px-3 rounded shadow-xl"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div class="flex flex-col items-center mb-5">
          <span class="text-sm text-gray-700 dark:text-gray-400">
            Showing{" "}
            <span class="font-semibold text-gray-900 dark:text-white">1</span>{" "}
            to{" "}
            <span class="font-semibold text-gray-900 dark:text-white">10</span>{" "}
            of{" "}
            <span class="font-semibold text-gray-900 dark:text-white">100</span>{" "}
            Entries
          </span>
          <div class="inline-flex mt-2 xs:mt-0">
            <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <svg
                class="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <button class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              Next
              <svg
                class="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Categories;

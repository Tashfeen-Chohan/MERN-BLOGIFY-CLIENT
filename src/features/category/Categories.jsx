import React, { useEffect, useState } from "react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "./categoryApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import useAuth from "../../hooks/useAuth";

const Categories = () => {
  const [searchBy, setSearchBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { status, isAdmin } = useAuth();

  let url = `categories?sortBy=${sortBy}&searchBy=${searchBy}&page=${pageNo}`;
  const { data, isLoading, isFetching, isError, error } =
    useGetCategoriesQuery(url);

  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Delete",
        width: "27rem",
        customClass: {
          title: "!font-bold",
          confirmButton:
            "!py-1 !px-4 !bg-red-600 !hover:bg-red-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          cancelButton:
            "!py-1 !px-4 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });

      if (result.isConfirmed) {
        const response = await deleteCategory(id);
        if (response.error) {
          Swal.fire({
            title: "Error!",
            text: response.error.data.message,
            width: "27rem",
            customClass: {
              title: "!text-red-500 !font-bold",
              confirmButton:
                "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
            },
          });
        } else {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occured on the server!",
        width: "27rem",
        customClass: {
          title: "!text-red-500 !font-bold",
          confirmButton:
            "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });
      console.log("Error deleting category");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );
  if (isError) return <p>{error}</p>;

  // OBJECT DESTRUCTURING
  const { categories, totalCategories, totalPages, page, limit } = data;

  return (
    <div className="">
      {/* SEARCH SECTION */}
      <div className="py-5 flex justify-center items-center flex-col max-w-[90%] mx-auto rounded shadow-lg my-7 bg-slate-100 md:max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold pb-4 text-center md:pb-7">
          BLOGIFY APP
        </h1>
        <div className="flex justify-center items-center gap-4 w-full px-4 md:pb-2">
          <input
            className="shadow-lg border-b-2 border-slate-600 px-2 w-[75%] py-[2px] md:w-[50%]  outline-none focus:border-b-2 focus:border-black"
            type="text"
            placeholder="Search any category..."
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
              setPageNo(1);
            }}
          />
          <button className="bg-blue-900 text-white rounded py-1 px-3 shadow-xl hover:bg-blue-800 transition-colors duration-500">
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col w-[90%] md:max-w-3xl mx-auto">
        {/* Add Category Container */}
        <div className="flex justify-between items-center w-full md:w-full mb-3 md:mb-0">
          <span className="bg-blue-900 transition-colors duration-500 hover:bg-blue-800 py-1 px-3 md:px-4 text-white rounded shadow-xl">
            Total : {totalCategories}
          </span>
          {status === "Admin" || status === "Publisher" ? (
            <Link to={`/categories/new`}>
              <button className="py-1 px-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-500 text-white rounded shadow-xl">
                Add Category
              </button>
            </Link>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold ">All Categories</h1>

        {/* CATEGORY SORTING */}
        <div className="self-end mt-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-200 shadow-md  rounded text-black outline-none px-2 py-1"
          >
            <option className="font-bold" value="">Post &#8593;</option>
            {isAdmin && <option value="date desc">Recent</option>}
            {isAdmin && <option value="date">Oldest</option>}
            <option value="name">A to Z &#8595;</option>
            <option value="name desc">Z to A &#8593;</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="w-full relative">
          {isFetching && (
            <div className="absolute inset-0  z-10 flex items-center justify-center">
              <BeatLoader size={15} color="black" />
            </div>
          )}
          <div className= {`${isFetching ? "filter blur-sm" : ""} relative overflow-x-auto md:w-full shadow-md sm:rounded mb-5 mt-3 w-[100%]`}>
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-md text-black uppercase bg-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Posts
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="font-semibold! text-sm">
                {categories.map((val, index) => (
                  <tr
                    key={val._id}
                    className="userTable bg-white border-b hover:bg-gray-200"
                  >
                    <td className="px-6 py-2">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-2">
                      <span>{val.name}</span>
                    </td>
                    <td className="px-6 py-2">
                      <span>{val.noOfPosts}</span>
                    </td>
                    <td className="px-6 py-2 text-right flex justify-start items-center gap-2">
                      <Link to={`/categories/${val.slug}`}>
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-500 py-1 px-3 rounded shadow-xl">
                          View
                        </button>
                      </Link>
                      {status === "Admin" && (
                        <Link to={`/categories/update/${val.slug}`}>
                          <button className="bg-[#FFC436] hover:bg-[#FFA732] transition-colors duration-500 py-1 px-3 rounded shadow-xl">
                            Edit
                          </button>
                        </Link>
                      )}
                      {status === "Admin" && (
                        <button
                          onClick={() => handleDelete(val._id)}
                          className="bg-[#FE0000] hover:bg-red-600 transition-colors duration-500 text-white py-1 px-3 rounded shadow-xl"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NO CATEGORY FOUND */}
        <div
          className={
            totalCategories === 0
              ? "block text-red-500 font-bold mb-4 text-lg"
              : "hidden"
          }
        >
          <p>No category found!</p>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-sm text-gray-700 ">
            Showing
            <span className="font-semibold text-gray-900 px-1">
              {totalCategories !== 0 ? (page - 1) * limit + 1 : totalCategories}
            </span>
            to
            <span className="font-semibold text-gray-900 px-1">
              {page * limit > totalCategories ? totalCategories : page * limit}
            </span>
            of
            <span className="font-semibold text-gray-900 px-1">
              {totalCategories}
            </span>
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPageNo(1)}
              className={
                page > 2
                  ? "bg-slate-700 hover:bg-slate-900 transition-colors duration-300 text-white rounded-s px-3"
                  : "hidden"
              }
            >
              Page 1
            </button>
            <button
              disabled={page === 1}
              onClick={() => setPageNo(page - 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-black bg-slate-200  hover:bg-slate-300 transition-colors duration-300"
            >
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPageNo(page + 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-slate-700 border-0 border-s  rounded-e hover:bg-slate-900 transition-colors duration-300"
            >
              Next
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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

import React from "react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "./categoryApi";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Categories = () => {
  const {
    data: categoires,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id)
      console.log(response)
      if (response.error){
        toast.error(response.error.data.message)
      } else {
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error("An error occured while deleting Category")
      console.log("Error deleting category")
    }
  }    

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
            className="shadow-lg border-b-2 px-2 w-[75%] py-[2px] md:w-[50%]  outline-none focus:border-b-2 focus:border-black"
            type="text"
            placeholder="Search any category..."
          />
          <button className="bg-slate-800 text-white rounded py-1 px-3 shadow-xl hover:bg-slate-700">
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col md:max-w-4xl mx-auto">
        {/* Add Category Container */}
        <div className="flex justify-between items-center w-[90%] mb-3 md:mb-0">
          <span className="bg-slate-800 transition-colors delay-100 hover:bg-slate-700 py-1 px-3 text-white rounded shadow-xl">
            Total : {categoires.length}
          </span>
          <Link to={`/categories/new`}>
            <button className="py-1 px-3 bg-blue-600 hover:bg-blue-700 transition-colors delay-100 text-white rounded shadow-xl">
              Add Category
            </button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold ">All Categories</h1>
        {/* MAIN TABLE */}
        <div className="relative overflow-x-auto max-w-[90%] md:w-full shadow-md sm:rounded my-5">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase bg-slate-200">
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
              {categoires.map((val, index) => (
                <tr
                  key={val._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold">{index + 1}</td>
                  <td className="px-6 py-4 font-bold">{val.name}</td>
                  <td className="px-6 py-4 text-right flex justify-start items-center gap-2">
                    <button className="bg-[#FFC436] hover:bg-[#FFA732] transition-colors delay-100 py-1 px-3 rounded shadow-xl">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(val._id)} className="bg-[#FE0000] hover:bg-red-600 text-white py-1 px-3 rounded shadow-xl">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;

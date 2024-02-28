import React, { useEffect, useState } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "./categoryApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";

const UpdateCategory = () => {
  const { slug } = useParams();
  const [updateCategory] = useUpdateCategoryMutation();
  const [name, setName] = useState("");
  const { data, isLoading } = useGetSingleCategoryQuery(slug);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Do you want to save the changes?",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Save",
        denyButtonText: "Don't Save",
        width: "27rem",
        customClass: {
          confirmButton:
            "!py-1 !px-4 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          cancelButton:
            "!py-1 !px-4 !bg-gray-600 !hover:bg-red-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          denyButton:
            "!py-1 !px-3 !bg-red-600 !hover:bg-red-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });

      if (result.isConfirmed) {
        const res = await updateCategory({slug, name });
        if (res.error) {
          Swal.fire({
            title: "Error!",
            text: res.error.data.message,
            width: "27rem",
            customClass: {
              title: "!text-red-500 !font-bold",
              confirmButton:
                "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
            },
          });
        } else {
          toast.success(res.data.message);
          navigate("/categories");
          setName("");
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: "Changes are not saved!",
          width: "27rem",
          customClass: {
            title: "!font-bold mt-5",
            confirmButton:
              "!py-1 !px-8 !mb-5 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occured on the server!",
        icon: "error",
        width: "27rem",
        customClass: {
          title: "!text-red-500 !font-bold",
          confirmButton:
            "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (data) {
      setName(data.category.name);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="shadow-xl rounded p-10 w-[90%] md:max-w-lg">
        <h1 className="font-bold text-3xl text-center pb-10">
          Update Category
        </h1>
        <form onSubmit={handleSubmit} className="w-full md:w-[70%] md:mx-auto">
          <div className="flex justify-center items-center gap-6 mb-4">
            <label htmlFor="name" className="text-2xl font-bold">
              <BiSolidCategory />
              {/* Name */}
            </label>
            <input
              className="md:w-full border-b-2 text-lg px-1 border-gray-500 outline-none focus:border-black"
              type="text"
              placeholder="Category Name"
              name="name"
              id="name"
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
              Update
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

export default UpdateCategory;

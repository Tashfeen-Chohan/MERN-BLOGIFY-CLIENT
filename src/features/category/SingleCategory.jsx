import React from "react";
import { useGetSingleCategoryQuery } from "./categoryApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { setCategory } from "../../app/dataSlice";
import { BeatLoader } from "react-spinners";

const SingleCategory = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetSingleCategoryQuery(slug);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleViewPosts = () => {
    dispatch(
      setCategory({
        id: category._id,
        name: category.name,
      })
    );
    navigate("/");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const {category} = data ?? null

  return (
    <div className="flex justify-center items-center min-h-screen mt-[-60px]">
      <div className="flex justify-start items-start flex-col bg-slate-100 px-5 pt-1 pb-7  rounded shadow-md w-[90%] md:max-w-sm">
        <Link
          to={-1}
          className="flex self-end hover:scale-125 transition-all duration-300"
        >
          <TiArrowBack size={40} />
        </Link>
        <h1 className="text-xl font-bold flex self-center  pb-3 mt-3 md:text-2xl">
          Category Information
        </h1>
        <h2>
          Category Name :
          <span className="font-semibold ml-2">{category.name}</span>
        </h2>
        <p>
          No. of Posts :
          <span className="font-semibold ml-2">{category.noOfPosts}</span>
        </p>
        {category.noOfPosts > 0 && (
          <div className="flex justify-center items-center mt-4 w-full">
            <button
              onClick={handleViewPosts}
              className="bg-slate-700 hover:bg-slate-800 transition-colors duration-300 text-white py-1 px-5 rounded  mt-3"
            >
              View Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleCategory;

import React from "react";
import { useGetSingleUserQuery } from "./userApi";
import { Link, useParams } from "react-router-dom";
import Profile2 from "../../assets/p2.png"
import { AiOutlineRollback } from "react-icons/ai";
import { TiArrowBack } from "react-icons/ti";
import { CiLogout } from "react-icons/ci";

const SingleUser = () => {
  const { id } = useParams();
  const { data } = useGetSingleUserQuery(id);

  return (
    <div className="flex justify-center items-center min-h-screen mt-[-60px]">
      <div className="flex justify-center items-center flex-col w-[85%] md:max-w-sm bg-slate-100 pb-10 pt-5 px-3 rounded  shadow-lg">
        <Link to={"/users"} className="flex self-end">
          <TiArrowBack size={40} />
        </Link>
        {/* <CiLogout size={35} className="flex self-end"/> */}
        <h1 className="text-2xl font-bold mb-6 mt-3">User Profile</h1>
        <img src={Profile2} width={70} alt="" />
        <p className="text-xl font-bold mt-3">{data?.capitalized.username}</p>
        <p className="text-sm">{data?.capitalized.email}</p>
        <p className="text-sm font-bold">Total Posts : {data?.totalPosts}</p>

        <div className="mt-3">
          <span className="bg-white rounded py-1 px-3 shadow-md text-sm">Roles :</span>
          {data?.capitalized.roles.map((role, index) => (
            <span
              className="bg-white font-semibold text-sm shadow-md py-1 px-3 rounded ml-3"
              key={index}
            >
              {role}
            </span>
          ))}
        </div>
        {data?.totalPosts > 0  && (
          <div className="flex justify-center items-center mt-4 w-full">
            <button className="w-[90%] bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 text-white py-1 px-3 rounded  mt-3">
              View Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUser;

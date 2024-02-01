import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetSingleUserQuery } from "./userApi";
import Profile2 from "../../assets/p2.png";
import { TiArrowBack } from "react-icons/ti";
import { Link } from "react-router-dom";


const Profile = () => {
  const { id } = useAuth();
  const { data } = useGetSingleUserQuery(id);
  return (
    <div className="mt-[-60px] flex justify-center items-center min-h-screen">
      <div className="bg-slate-100 shadow-xl pb-10 pt-5 w-[85%] md:max-w-md flex justify-center items-center flex-col">
        <Link to={"/users"} className="flex self-end px-3">
          <TiArrowBack size={40} />
        </Link>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p>You can update the details!</p>
        <img className="my-4" src={Profile2} alt="Profile Icon" width={70} />
        <div className="flex w-full justify-center items-center flex-col gap-3">
          <span className="bg-white w-[70%] text-center py-1 rounded shadow-md flex-auto">
            {data?.capitalized.username}
          </span>
          <span className="bg-white py-1 w-[70%] text-center rounded shadow-md">
            {data?.capitalized.email}
          </span>
        </div>
        <span className="bg-white mt-3 py-1 w-[70%] text-center rounded shadow-md">
          Total Posts : {data?.totalPosts}
        </span>
        <button className="bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 text-white mt-7 py-1 w-[70%] text-center rounded shadow-md">
          Update
        </button>
      </div>
    </div>
  );
};

export default Profile;

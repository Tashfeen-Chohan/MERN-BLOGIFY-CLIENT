import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetSingleUserQuery } from "./userApi";
import Profile2 from "../../assets/p2.png";
import { TiArrowBack } from "react-icons/ti";
import { Link } from "react-router-dom";

const Profile = () => {
  const { id, profile } = useAuth();
  const { data } = useGetSingleUserQuery(id);
  return (
    <div className="mt-[-60px] flex justify-center items-center min-h-screen">
      <div className="bg-slate-100 shadow-xl pb-10 pt-5 w-[85%] md:max-w-md flex justify-center items-center flex-col">
        <Link
          to={-1}
          className="flex self-end px-3 hover:scale-125 transition-all duration-300"
        >
          <TiArrowBack size={40} />
        </Link>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p>You can update the details!</p>
        <div className="my-5 w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mx-auto">
          <img
            src={profile}
            alt="User Profile"
            className="w-full h-full object-cover text-white text-center"
          />
        </div>

        {/* <img className="my-4" src={Profile2} alt="Profile Icon" width={70} /> */}
        <div className="flex w-full justify-center items-center flex-col gap-3">
          <span className="bg-white hover:bg-cyan-200 transition-colors duration-300 w-[70%] text-center py-1 rounded shadow-md flex-auto">
            {data?.capitalized.username}
          </span>
          <span className="bg-white hover:bg-cyan-200 transition-colors duration-300 py-1 w-[70%] text-center rounded shadow-md">
            {data?.capitalized.email}
          </span>
          {data?.capitalized.roles.includes("Publisher") && (
            <span className="bg-white hover:bg-cyan-200 transition-colors duration-300 py-1 w-[70%] text-center rounded shadow-md">
              Total Posts : {data?.totalPosts}
            </span>
          )}
        </div>
        <Link to={"/profile/edit"} className=" flex self-center w-full">
          <button className="bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 text-white mt-7 py-1 w-[70%] mx-auto text-center rounded shadow-md">
            Update
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;

import React from "react";
import useAuth from "../../hooks/useAuth";
import { useGetSingleUserQuery } from "./userApi";
import { TiArrowBack } from "react-icons/ti";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const Profile = () => {
  const { slug } = useAuth();
  const { data, isLoading } = useGetSingleUserQuery(slug);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const { user } = data ?? null;

  return (
    <div className=" flex justify-center items-center mt-10 md:mt-6">
      <div className="bg-slate-100 rounded-xl shadow-xl pb-10  pt-5 w-[85%] md:max-w-sm flex justify-center items-center flex-col">
        <Link
          to={-1}
          className="flex self-end px-3 hover:scale-125 transition-all duration-300"
        >
          <TiArrowBack size={40} />
        </Link>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p>You can update the details!</p>
        <div className="shadow-xl my-5 w-32 h-32 rounded-full overflow-hidden mx-auto">
          <img
            src={user.profile}
            alt="User Profile"
            className="w-full h-full rounded-full border-8 border-slate-50 object-cover text-black text-center"
          />
        </div>
        <div className="text-sm flex w-full justify-center items-center flex-col gap-3">
          <span className="bg-white hover:bg-cyan-200 transition-colors duration-300 w-[90%] text-center py-1 rounded shadow-md flex-auto">
            {user.username}
          </span>
          <span className="bg-white hover:bg-cyan-200 transition-colors duration-300 py-1 w-[90%] text-center rounded shadow-md">
            {user.email}
          </span>
          {user.roles.includes("Publisher") && (
            <span className="bg-white hover:bg-cyan-200 transition-colors duration-300 py-1 w-[90%] text-center rounded shadow-md">
              Total Posts : {user.noOfPosts}
            </span>
          )}
        </div>
        <Link to={`/profile/${slug}/edit`} className=" flex self-center w-full">
          <button className="bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 text-white mt-7 py-1 w-[90%] mx-auto text-center rounded shadow-md">
            Update
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;

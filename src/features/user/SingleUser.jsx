import React from "react";
import { useGetSingleUserQuery } from "./userApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setPublisher } from "../../app/dataSlice";
import { BeatLoader } from "react-spinners";

const SingleUser = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetSingleUserQuery(slug);
  const { status } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleViewPosts = () => {
    dispatch(
      setPublisher({
        id: data?.user._id,
        name: data?.user.username,
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

  const { user } = data ?? null;

  return (
    <div className="flex justify-center items-center mt-16 md:mt-8">
      <div className="flex justify-center items-center flex-col w-[85%] md:max-w-sm bg-slate-100 pb-7 pt-5 px-3 rounded-xl shadow-xl">
        <Link
          to={-1}
          className="flex self-end hover:scale-125 transition-all duration-300"
        >
          <TiArrowBack size={40} />
        </Link>
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="shadow-xl my-4 w-32 h-32 rounded-full overflow-hidden mx-auto">
          <img
            src={user.profile}
            alt="User Profile"
            className="w-full h-full rounded-full border-8 border-slate-50 object-cover text-black text-center"
          />
        </div>

        <div className="text-sm flex w-full justify-center items-center flex-col gap-3 mt-3">
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
        {status === "Admin" && (
          <div className="mt-3 w-[90%] bg-white hover:bg-cyan-200 transition-colors duration-300 px-3 py-1 rounded shadow-xl text-center">
            <span>
              Roles :
              {user.roles.map((role, index) => (
                <span className="bg-white font-semibold p-1 " key={index}>
                  {role}
                  {index < user.roles.length - 1 && ", "}
                </span>
              ))}
            </span>
          </div>
        )}
        {user.noOfPosts > 0 && (
          <div className="flex justify-center items-center mt-4 w-full">
            <button
              onClick={handleViewPosts}
              className="w-[90%] bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 text-white py-1 px-3 rounded  mt-3"
            >
              View Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUser;

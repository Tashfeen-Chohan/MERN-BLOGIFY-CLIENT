import React from "react";
import { useGetSingleUserQuery } from "./userApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setPublisher } from "../../app/dataSlice";

const SingleUser = () => {
  const { id } = useParams();
  const { data } = useGetSingleUserQuery(id);
  const {status} = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleViewPosts = () => {

    dispatch(setPublisher({
      id: data?.capitalized._id,
      name: data?.capitalized.username
    }))
    navigate("/")
  }

  return (
    <div className="flex justify-center items-center min-h-screen mt-[-60px]">
      <div className="flex justify-center items-center flex-col w-[85%] md:max-w-sm bg-slate-100 pb-10 pt-5 px-3 rounded  shadow-lg">
        <Link
          to={-1}
          className="flex self-end hover:scale-125 transition-all duration-300"
        >
          <TiArrowBack size={40} />
        </Link>
        <h1 className="text-2xl font-bold">User Profile</h1>
        <div className="my-5 w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mx-auto">
          <img
            src={data?.capitalized.profile}
            alt="User Profile"
            className="w-full h-full rounded-full  object-cover text-white text-center"
          />
        </div>
        {/* <img className="my-5" src={Profile2} alt="Profile Icon" width={70} /> */}

        <div className="flex w-full justify-center items-center flex-col gap-3">
          <span className="bg-white w-[75%] text-center py-1 rounded shadow-md flex-auto">
            {data?.capitalized.username}
          </span>
          <span className="bg-white py-1 w-[75%] text-center rounded shadow-md">
            {data?.capitalized.email}
          </span>
          {data?.capitalized.roles.includes("Publisher") && (
            <span className="bg-white py-1 w-[75%] text-center rounded shadow-md">
              Total Posts : {data?.totalPosts}
            </span>
          )}
        </div>
        {status==="Admin" && <div className="mt-3 w-[75%] bg-white px-3 py-1 rounded shadow-xl text-center">
          <span>
            Roles : 
            {data?.capitalized.roles.map((role, index) => (
              <span className="bg-white font-semibold p-1 " key={index}>
                 {role}
                {index < data?.capitalized.roles.length - 1 && ", "}
              </span>
            ))}
          </span>
        </div>}
        {data?.totalPosts > 0 && (
          <div className="flex justify-center items-center mt-4 w-full">
            <button onClick={handleViewPosts} className="w-[75%] bg-cyan-600 hover:bg-cyan-700 transition-colors duration-300 text-white py-1 px-3 rounded  mt-3">
              View Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUser;

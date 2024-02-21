import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { AiFillDashboard, AiFillSetting } from "react-icons/ai";
import { FaComments, FaUsers } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { LuLogOut } from "react-icons/lu";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { RiArticleFill } from "react-icons/ri";
import { FaFilePen } from "react-icons/fa6";

const Sidebar = ({ showSidebar }) => {
  const { isAdmin, isPublisher, username } = useAuth();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/logout");
      toast.success(res.data.message);
      dispatch(logout());
      navigate("/login");
      // Clear the "jwt" cookie on the client side
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occured on the server!",
        width: "27rem",
        customClass: {
          title: "!text-red-500 !font-bold",
          confirmButton:
            "!py-2 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });
    }
  };

  return (
    <div
      className={`shadow-md shadow-black fixed z-10 left-0 md:translate-x-0 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      } md:block bg-[#162B56] text-white w-64 h-screen transition-transform duration-700 ease-in-out`}
    >
      <ul className="pt-24 px-3">
        <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
          <IoHome size={20} />
          <Link to={"/"}>Home</Link>
        </li>
        {isAdmin && (
          <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
            <AiFillDashboard size={20} />
            <Link to={"/dashboard"}>Dashboard</Link>
          </li>
        )}
        {isPublisher && (
          <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
            <FaFilePen size={20} />
            <Link to={"/posts/new"}>Write</Link>
          </li>
        )}
        {isPublisher && (
          <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
            <RiArticleFill size={20} />
            <Link to={`/posts/${username}`}>My Posts</Link>
          </li>
        )}
        {isAdmin && (
          <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
            <FaComments size={20} />
            <Link to={"/all-comments"}>Comments</Link>
          </li>
        )}
        {isAdmin && (
          <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
            <FaUsers size={20} />
            <Link to={"/users"}>Users</Link>
          </li>
        )}
        {!isAdmin && (
          <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
            <FaUsers size={20} />
            <Link to={"/users"}>Publishers</Link>
          </li>
        )}
        <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
          <BiSolidCategoryAlt size={20} />
          <Link to={"/users"}>Categories</Link>
        </li>
        <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
          <AiFillSetting size={20} />
          <Link to={"/profile"}>Settings</Link>
        </li>
        <li className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
          <LuLogOut size={20} />
          <span onClick={handleLogout}>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { BsFillInfoCircleFill } from "react-icons/bs";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const { isAdmin, isPublisher, slug, } = useAuth();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const closeSidebar = () => {
    setShowSidebar(false)
  }

  const handleLogout = async () => {
    closeSidebar()
    try {
      const res = await axios.post("https://mern-blogify-server.vercel.app/auth/logout");
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
        <Link to={"/"} onClick={closeSidebar} className={`${location.pathname === "/" && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <IoHome size={20} />
          <span>Home</span>
        </Link>
        {isAdmin && (
          <Link to={"/dashboard"} onClick={closeSidebar} className={`${location.pathname === "/dashboard" && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
            <AiFillDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        )}
        {isPublisher && (
          <Link to={"/posts/new"} onClick={closeSidebar} className={`${location.pathname === "/posts/new" && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
            <FaFilePen size={20} />
            <span>Write</span>
          </Link>
        )}
        {isPublisher && (
          <Link to={`/posts/my-posts/${slug}`} onClick={closeSidebar} className={`${location.pathname.includes("/posts/my-posts") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
            <RiArticleFill size={20} />
            <span>My Posts</span>
          </Link>
        )}
        {isAdmin && (
          <Link to={"/all-comments"} onClick={closeSidebar} className={`${location.pathname === "/all-comments" && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
            <FaComments size={20} />
            <span>Comments</span>
          </Link>
        )}
        {isAdmin && (
          <Link to={"/users"} onClick={closeSidebar} className={`${location.pathname.includes("/users") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
            <FaUsers size={20} />
            <span>Users</span>
          </Link>
        )}
        {!isAdmin && (
          <Link to={"/users"} onClick={closeSidebar} className={`${location.pathname.includes("/users") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
            <FaUsers size={20} />
            <span>Publishers</span>
          </Link>
        )}
        <Link to={"/categories"} onClick={closeSidebar} className={`${location.pathname.includes("/categories") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <BiSolidCategoryAlt size={20} />
          <span>Categories</span>
        </Link>
        <Link to={`/profile/${slug}`} onClick={closeSidebar} className={`${location.pathname.includes("/profile") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <AiFillSetting size={20} />
          <span>Settings</span>
        </Link>
        <Link to={"/about-me"} onClick={closeSidebar} className={`${location.pathname.includes("/about-me") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <BsFillInfoCircleFill size={17} />
          <span>About</span>
        </Link>
        <span onClick={handleLogout} className="transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3">
          <LuLogOut size={20} />
          <span>Logout</span>
        </span>
      </ul>
    </div>
  );
};

export default Sidebar;

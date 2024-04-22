import React, { useState } from "react";
import { GiHamburgerMenu, GiCrossMark } from "react-icons/gi";
import useAuth from "../hooks/useAuth";
import { FaCaretDown } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import axios from "axios";
import { HiDotsVertical } from "react-icons/hi";

const Navbar = ({ showSidebar, setShowSidebar }) => {
  const { status, username, profile, slug } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const viewProfile = () => {
    setDropdownOpen(false);
    navigate(`/profile/${slug}`);
  };

  const changePassword = () => {
    setDropdownOpen(false);
    navigate(`/profile/${slug}/change-password`);
  };

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      const res = await axios.post("https://mern-blogify-server.vercel.app/auth/logout");
      // const res = await axios.post("http://localhost:3000/auth/logout");
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
    <nav className="z-20 flex justify-between items-center bg-[#162B56] text-white py-3 px-5 md:pl-20 md:pr-7  shadow-md shadow-gray-800 fixed w-full">
      {/* LOGO */}
      <div className="flex gap-4 md:gap-8 items-center flex-row-reverse md:flex-row">
        <h2 className="text-2xl italic font-semibold font-sans">Blogify</h2>
        <span className="hidden md:block text-2xl">
          <GiHamburgerMenu />
        </span>
        <span
          className="md:hidden text-2xl"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <GiCrossMark /> : <GiHamburgerMenu />}
        </span>
      </div>
      {/* PANEL */}
      {status !== "" && (
        <div className="hidden md:block text-lg font-serif">
          <span>Welcome to Blogify Platform</span>
          {status === "User" && <span className="ml-3">[ User Panel ]</span>}
          {status === "Publisher" && (
            <span className="ml-3">[ Publisher Panel ]</span>
          )}
          {status === "Admin" && <span className="ml-3">[ Admin Panel ]</span>}
        </div>
      )}
      {/* PROFILE - LAPTOP */}
      {status !== "" && (
        <div className="hidden md:block">
          <div className="cursor-pointer flex justify-center items-center gap-2">
            <img
              src={profile}
              alt="Profile"
              onClick={toggleDropdown}
              className="h-9 w-9 object-cover rounded-full"
            />
            <span onClick={toggleDropdown} className="font-semibold font-serif">
              {username}
            </span>
            <FaCaretDown onClick={toggleDropdown} />
            <button
              className="bg-white text-sm font-serif font-bold py-1 px-2 rounded shadow-xl text-blue-900"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <div
            className={`absolute right-20 top-14 w-56 p-2 bg-primary border border-gray-500 rounded shadow-xl ${
              isDropdownOpen ? "block" : "hidden"
            }`}
          >
            <ul className="flex justify- items-start flex-col">
              <li
                className="hover:bg-blue-800 w-full px-2 py-1 rounded transition-colors duration-300"
                onClick={viewProfile}
              >
                Profile
              </li>
              <li
                className="hover:bg-blue-800 w-full px-2 py-1 rounded transition-colors duration-300"
                onClick={changePassword}
              >
                Change Password
              </li>
              <hr className="w-full my-1" />
              <li
                onClick={handleLogout}
                className="hover:bg-blue-800 w-full px-2 py-1 rounded transition-colors duration-300"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* PROFILE - MOBILE */}
      {status !== "" && (
        <div className="relative md:hidden ">
          <HiDotsVertical
            className="bg-blue-800 p-1 rounded-sm"
            onClick={toggleDropdown}
            size={28}
          />
          <div
            className={`absolute right-0 mt-3 w-48 p-2 bg-primary border border-gray-500 rounded shadow-xl ${
              isDropdownOpen ? "block" : "hidden"
            }`}
          >
            <ul>
              <li
                className="hover:bg-slate-700 w-full px-2 py-1 rounded transition-colors duration-300"
                onClick={viewProfile}
              >
                Profile
              </li>
              <li
                className="hover:bg-slate-700 w-full px-2 py-1 rounded transition-colors duration-300"
                onClick={changePassword}
              >
                Change Password
              </li>
              <hr className="my-1" />
              <li
                className="hover:bg-slate-700 w-full px-2 py-1 rounded transition-colors duration-300"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* NON - USER LAPTOP */}
      {status === "" && (
        <div className="hidden md:flex gap-5 text-xl font-serif">
          <Link
            to="/"
            className={`${location.pathname === "/" ? "text-cyan-300" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/users"
            className={`${
              location.pathname === "/users" ? "text-cyan-300" : ""
            }`}
          >
            Publishers
          </Link>
          <Link
            to="/categories"
            className={`${
              location.pathname === "/categories" ? "text-cyan-300" : ""
            }`}
          >
            Categories
          </Link>
          <Link
            to="/about-me"
            className={`${
              location.pathname === "/about-me" ? "text-cyan-300" : ""
            }`}
          >
            About
          </Link>

          <div className="flex  items-center mt-5 md:mt-0 gap-3 md:ml-5 ">
            <Link to={"/register"}>
              <button className="text-sm font-bold py-1 bg-white hover:bg-slate-200 transition-all duration-500 border px-2 rounded shadow-xl text-blue-800">
                Sign up
              </button>
            </Link>
            <Link to={"/login"}>
              <button className="bg-transparent hover:bg-blue-900 hover:border hover:text-white transition-all duration-500 border text-sm font-bold py-1 px-3 rounded  shadow-xl">
                Login
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* NON - USER MOBILE */}
      {status === "" && (
        <div className="md:hidden flex items-center justify-center gap-3">
          <Link to={"/register"}>
            <button className="text-sm font-bold py-1 bg-white hover:bg-slate-200 transition-all duration-500 border px-2 rounded shadow-xl text-blue-800">
              Sign up
            </button>
          </Link>
          <Link to={"/login"}>
            <button className="bg-transparent hover:bg-blue-900 hover:border hover:text-white transition-all duration-500 border text-sm font-bold py-1 px-3 rounded  shadow-xl">
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

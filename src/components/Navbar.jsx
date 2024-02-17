import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice";
import axios from "axios";
import { HiDotsVertical } from "react-icons/hi";
import { FaCaretDown } from "react-icons/fa";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [sendLogout] = useSendLogoutMutation();
  const dispatch = useDispatch();
  const { status, isPublisher, isAdmin, firstName, profile, username } = useAuth();
  const navigate = useNavigate();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const viewProfile = () => {
    navigate("/profile");
    setShowNavbar(false);
    toggleDropdown();
  };

  const changePassword = () => {
    setDropdownOpen(false);
    navigate("/profile/change-password");
  };


  const handleLogout = async () => {
    try {
      setShowNavbar(false);
      setDropdownOpen(false);
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
    <nav className="navbar">
      <div
        className={`container flex justify-start ${
          status !== "" && "justify-between"
        }`}
      >
        <div className="menu-icon" onClick={handleShowNavbar}>
          {showNavbar ? (
            <GiCrossMark size={20} />
          ) : (
            <GiHamburgerMenu size={20} />
          )}
        </div>
        <div className="logo">
          <Link to={"/"}>Blogify</Link>
        </div>
        {status !== "" && (
          <div className="relative md:hidden ">
            <HiDotsVertical onClick={toggleDropdown} size={20} />
            <div
              className={`absolute right-0 mt-3 w-48 p-2 bg-gray-800 border border-gray-600 rounded shadow-xl ${
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
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            <li onClick={handleShowNavbar}>
              <NavLink to="/">Home</NavLink>
            </li>
            {isPublisher && (
              <li onClick={handleShowNavbar}>
                <NavLink to="/posts/new">Write</NavLink>
              </li>
            )}
            {isPublisher && (
              <li onClick={handleShowNavbar}>
                <NavLink to={`/posts/${username}`}>My Posts</NavLink>
              </li>
            )}
            {isAdmin && (
              <li onClick={handleShowNavbar}>
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
              </li>
            )}
            <li onClick={handleShowNavbar}>
              <NavLink to="/categories">Categories</NavLink>
            </li>
            <li onClick={handleShowNavbar}>
              {status === "Admin" ? (
                <NavLink to="/users">Users</NavLink>
              ) : (
                <NavLink to="/users">Publishers</NavLink>
              )}
            </li>
            {status ? (
              <div className="flex relative items-center mt-5 md:mt-0 gap-3 md:ml-5 ">
                <div
                  onClick={toggleDropdown}
                  className="flex justify-center items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden mx-auto">
                    <img
                      src={profile}
                      alt="Profile"
                      className="w-full h-full object-cover text-white text-center text-xs"
                    />
                  </div>
                  <p className="ml-1 font-semibold">
                    WELCOME <span>{firstName}!</span>
                  </p>
                  <FaCaretDown />
                </div>
                <div
                  className={`absolute right-20 top-10 w-56 p-2 bg-gray-800 border border-gray-600 rounded shadow-xl ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="flex justify- items-start flex-col">
                    <li
                      className="hover:bg-slate-600 w-full px-2 py-1 rounded transition-colors duration-300"
                      onClick={viewProfile}
                    >
                      Profile
                    </li>
                    <li
                      className="hover:bg-slate-600 w-full px-2 py-1 rounded transition-colors duration-300"
                      onClick={changePassword}
                    >
                      Change Password
                    </li>
                    <hr className="w-full my-1" />
                    <li
                      onClick={handleLogout}
                      className="hover:bg-slate-600 w-full px-2 py-1 rounded transition-colors duration-300"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold py-1 bg-slate-200 hover:bg-slate-300 transition-all duration-500 border px-2 rounded shadow-xl text-black"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center mt-5 md:mt-0 gap-3 md:ml-5 ">
                <Link to={"/register"}>
                  <button
                    onClick={handleShowNavbar}
                    className="text-sm font-bold py-1 bg-slate-200 hover:bg-slate-300 transition-all duration-500 border px-2 rounded shadow-xl text-black"
                  >
                    Sign up
                  </button>
                </Link>
                <Link to={"/login"}>
                  <button
                    onClick={handleShowNavbar}
                    className="bg-transparent hover:bg-slate-700 hover:border hover:text-white transition-all duration-500 border text-sm font-bold py-1 px-3 rounded  shadow-xl"
                  >
                    Login
                  </button>
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

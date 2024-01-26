import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice";
import { FaRegCircleUser, FaRegUser } from "react-icons/fa6";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [sendLogout] = useSendLogoutMutation();
  const dispatch = useDispatch();
  const { status, firstName } = useAuth();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleLogout = async () => {
    try {
      setShowNavbar(!showNavbar);
      const res = await sendLogout();
      if (res.error) {
        Swal.fire({
          title: "Error!",
          text: res.error.data.message,
          width: "27rem",
          customClass: {
            title: "!text-red-500 !font-bold",
            confirmButton:
              "!py-2 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          },
        });
      } else {
        toast.success(res.data.message);
        dispatch(logout());
      }
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
      <div className="container">
        <div className="logo">Blogify</div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          {showNavbar ? (
            <GiCrossMark size={20} />
          ) : (
            <GiHamburgerMenu size={20} />
          )}
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            <li onClick={handleShowNavbar}>
              <NavLink to="/">Home</NavLink>
            </li>
            <li onClick={handleShowNavbar}>
              <NavLink to="/categories">Categories</NavLink>
            </li>
            <li onClick={handleShowNavbar}>
              <NavLink to="/users">Users</NavLink>
            </li>
            {status ? (
              <div className="flex items-center mt-5 md:mt-0 gap-3 md:ml-5 ">
                <div className="flex justify-center items-center gap-3">
                  <FaRegCircleUser size={25} />
                  {/* <FaRegUser size={25} /> */}
                  <p className="font-semibold">
                    WELCOME <span>{firstName}!</span>
                  </p>
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

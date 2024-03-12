import React from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import {  BsFillInfoCircleFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

const SimpleSidebar = ({ showSidebar, setShowSidebar }) => {

  const location = useLocation()

  const closeSidebar = () => {
    setShowSidebar(false)
  }

  return (
    <div
      className={`shadow-md shadow-black fixed z-10 left-0 md:translate-x-0 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      } md:hidden bg-[#162B56] text-white w-64 h-screen transition-transform duration-700 ease-in-out`}
    >
      <ul className="pt-24 px-3">
        <Link to={"/"} onClick={closeSidebar} className={`${location.pathname === "/" && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <IoHome size={20} />
          <span>Home</span>
        </Link>
        <Link to={"/users"} onClick={closeSidebar} className={`${location.pathname.includes("/users") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <FaUsers size={20} />
          <span >Publishers</span>
        </Link>
        <Link to={"/categories"} onClick={closeSidebar} className={`${location.pathname.includes("/categories") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <BiSolidCategoryAlt size={20} />
          <span>Categories</span>
        </Link>
        <Link to={"/about-me"} onClick={closeSidebar} className={`${location.pathname.includes("/about-me") && "bg-blue-900"} transition-colors duration-500 ease-in-out mb-1 flex justify-start items-center gap-3 hover:bg-blue-900 py-2 rounded px-3`}>
          <BsFillInfoCircleFill size={17} />
          <span>About</span>
        </Link>
      </ul>
    </div>
  );
};

export default SimpleSidebar;

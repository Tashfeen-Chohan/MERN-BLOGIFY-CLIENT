import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({showSidebar}) => {
  return (
    <div className={`fixed z-10 left-0 md:translate-x-0 ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:block bg-gray-800 w-64 h-screen transition-transform duration-700 ease-in-out`}>
      <div className="p-4">
        <h2 className="text-white text-xl font-bold">Sidebar</h2>
      </div>
      <ul>
        <li>
          <Link to={"/"}  className="block p-4 text-gray-300 hover:bg-gray-700">
            Home
          </Link>
        </li>
        <li>
          <Link to={"/dashboard"}
            
            className="block p-4 text-gray-300 hover:bg-gray-700"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link to={"/all-comments"}
            
            className="block p-4 text-gray-300 hover:bg-gray-700"
          >
            Comments
          </Link>
        </li>
        <li>
          <Link to={"/categories"}
            
            className="block p-4 text-gray-300 hover:bg-gray-700"
          >
            Categories
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

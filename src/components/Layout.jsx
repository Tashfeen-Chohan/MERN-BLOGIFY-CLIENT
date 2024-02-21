import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";
import SimpleSidebar from "./SimpleSidebar";

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { status } = useAuth();

  return (
    <div className="h-screen flex">
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="flex w-full">
        {status === "" ? (
          <SimpleSidebar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />
        ) : (
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        )}
        <div
          className={`flex flex-col w-full  ${
            status !== "" ? "md:pl-64" : "md:pl-0"
          }`}
        >
          <div className="mt-14  overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

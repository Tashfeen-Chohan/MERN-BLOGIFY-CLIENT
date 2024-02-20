import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="h-screen flex">
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="flex w-full">
        <Sidebar showSidebar={showSidebar} />
        <div className="flex flex-col w-full md:pl-64">
          <div className="p-2 mt-14  overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

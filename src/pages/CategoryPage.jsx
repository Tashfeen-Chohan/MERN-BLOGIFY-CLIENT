import React from "react";
import Sidebar from "../components/Sidebar";
import Categories from "../features/category/Categories";

const CategoryPage = () => {
  return (
    <div className="md:flex">
      <div className="hidden md:w-1/5">
        <Sidebar />
      </div>
      <div className="w-full md:w-[80%]">
      <Categories />
      </div>
    </div>
  );
};

export default CategoryPage;

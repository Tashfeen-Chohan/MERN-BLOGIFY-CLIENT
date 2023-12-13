import React from "react";
import { useGetCategoriesQuery } from "./categoryApi";

const Categories = () => {
  const {
    data: allCategoriesData,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();
  // console.log(allCategoriesData);

  if (isLoading) return <p>Loading....</p>
  if (isError) return <p>{error}</p>

  console.log("loading: ", isLoading)
  console.log(allCategoriesData)

  return (
    <div>
      <div>
        <h1>Categories</h1>
        <div>
          <input type="text" placeholder="Search any category..." />
          <button>Search</button>
        </div>
        <hr />

        <div>
          <h1>All Categories</h1>
        </div>
      </div>
    </div>
  );
};

export default Categories;

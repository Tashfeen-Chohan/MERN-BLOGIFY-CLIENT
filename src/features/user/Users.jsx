import React, { useEffect, useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery } from "./userApi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import useAuth from "../../hooks/useAuth";

const Users = () => {
  const [searchBy, setSearchBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const { status } = useAuth();

  if (status === "Admin") {
    var url = `users?sortBy=${sortBy}&searchBy=${searchBy}&filterBy=${filterBy}&page=${pageNo}`;
  } else {
    url = `users?sortBy=${sortBy}&searchBy=${searchBy}&filterBy=Publisher&page=${pageNo}`;
  }

  const { data, isLoading, isError, error } = useGetUsersQuery(url);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Delete",
        width: "27rem",
        customClass: {
          title: "!font-bold",
          confirmButton:
            "!py-1 !px-4 !bg-red-600 !hover:bg-red-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          cancelButton:
            "!py-1 !px-4 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });

      if (result.isConfirmed) {
        const response = await deleteUser(id);
        if (response.error) {
          Swal.fire({
            title: "Error!",
            text: response.error.data.message,
            width: "27rem",
            customClass: {
              title: "!text-red-500 !font-bold",
              confirmButton:
                "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
            },
          });
        } else {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occured on the server!",
        width: "27rem",
        customClass: {
          title: "!text-red-500 !font-bold",
          confirmButton:
            "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    )
  if (isError) return <p>{error}</p>;

  // OBJECT DESTRUCTURING
  const { users, totalUsers, totalPages, page, limit } = data;

  return (
    <div>
      {/* SEARCH SECTION */}
      <div className="py-5 flex justify-center items-center flex-col max-w-[90%] mx-auto rounded shadow-lg my-7 bg-slate-100 md:max-w-lg">
        <h1 className="text-3xl font-bold pb-4 text-center md:pb-7">
          BLOGIFY APP
        </h1>
        <div className="flex justify-center items-center gap-4 w-full px-4 md:pb-2">
          <input
            className="shadow-lg border-b-2 border-slate-400 px-2 w-[75%] py-[2px] md:w-[50%]  outline-none focus:border-b-2 focus:border-black"
            type="text"
            placeholder="Search any Publisher..."
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
              setPageNo(1);
            }}
          />
          <button className="bg-blue-900 text-white rounded py-1 px-3 shadow-xl hover:bg-blue-800 transition-colors duration-500">
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center flex-col w-[90%] md:max-w-3xl mx-auto">
        {/* TOTAL USERS */}
        <div className="flex justify-between items-center w-full mb-3 md:mb-0">
          <span className="bg-blue-900 transition-colors duration-500 hover:bg-slate-700 py-1 px-3 md:px-4 text-white rounded shadow-xl">
            Total : {totalUsers}
          </span>
          {status === "Admin" && (
            <Link to={`/register`}>
              <button className="py-1 px-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-500 text-white rounded shadow-xl">
                Add User
              </button>
            </Link>
          )}
        </div>
        {status === "Admin" ? (
          <h1 className="text-2xl font-bold ">All Users</h1>
        ) : (
          <h1 className="text-2xl font-bold ">All Publishers</h1>
        )}

        {/* USER SORTING & FILTERATION */}
        <div className="flex justify-between items-center w-full mt-3">
          {status === "Admin" && (
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-slate-200 shadow-md  rounded text-black outline-none px-2 py-1"
            >
              <option value="">All Users</option>
              <option value="Publisher">Publisers</option>
              <option value="Admin">Admins</option>
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-200 shadow-md  rounded text-black outline-none px-2 py-1 flex"
          >
            <option className="font-bold" value="">
              Sort by Default
            </option>
            <option value="name">Name Asc</option>
            <option value="name desc">Name Desc</option>
            <option value="date desc">Newest</option>
            <option value="date">Oldest</option>
          </select>
        </div>

        {/* MAIN TABLE */}
        <table
          className={
            "min-w-full border-collapse block md:table mt-3 mb-5 shadow-xl"
          }
        >
          <thead className="block md:table-header-group bg-slate-300 text-black">
            <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                #
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Profile
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Username
              </th>
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Email
              </th>
              {status === "Admin" && (
                <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                  Roles
                </th>
              )}
              <th className="p-2 font-bold md:border md:border-grey-500 text-left block md:table-cell">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group font-semibold! text-sm">
            {users?.map((val, index) => (
              <tr
                key={val._id}
                className="userTable my-3 rounded shadow-md md:shadow-none border border-grey-500 md:border-none block md:table-row hover:bg-gray-200"
              >
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    #
                  </span>
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left  flex items-center md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Profile
                  </span>
                  <div className="w-9 h-9 overflow-hidden inline-block md:block rounded-full">
                    {val.profile && (
                      <img
                        src={val.profile}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Username
                  </span>
                  {val.username}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Email
                  </span>
                  {val.email}
                </td>
                {status === "Admin" && (
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      Roles
                    </span>
                    {val.roles?.map((role, index) => (
                      <span key={index}>
                        {role}
                        {index < val.roles?.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                )}
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    Actions
                  </span>
                  <Link to={`/users/single/${val._id}`}>
                    <button className="mr-2 bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-500 py-1 px-3 rounded shadow-xl">
                      View
                    </button>
                  </Link>
                  {status === "Admin" && (
                    <>
                      <Link to={`/users/update/${val._id}`}>
                        <button className="mr-2 bg-[#FFC436] hover:bg-[#FFA732] transition-colors duration-500 text-black py-1 px-3 shadow-xl rounded">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(val._id)}
                        className="bg-[#FE0000] hover:bg-red-600 transition-colors duration-500 text-white py-1 px-3 rounded shadow-xl"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* NO USER FOUND */}
        <div
          className={
            totalUsers === 0
              ? "block text-red-500 font-bold mb-4 text-lg"
              : "hidden"
          }
        >
          <p>No user found!</p>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-sm text-gray-700 ">
            Showing
            <span className="font-semibold text-gray-900 px-1">
              {totalUsers !== 0 ? (page - 1) * limit + 1 : totalUsers}
            </span>
            to
            <span className="font-semibold text-gray-900 px-1">
              {page * limit > totalUsers ? totalUsers : page * limit}
            </span>
            of
            <span className="font-semibold text-gray-900 px-1">
              {totalUsers}
            </span>
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => setPageNo(1)}
              className={
                page > 2
                  ? "bg-slate-700 hover:bg-slate-900 transition-colors duration-300 text-white rounded-s px-3"
                  : "hidden"
              }
            >
              Page 1
            </button>
            <button
              disabled={page === 1}
              onClick={() => setPageNo(page - 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-black bg-slate-200  hover:bg-slate-300 transition-colors duration-300"
            >
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPageNo(page + 1)}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-slate-700 border-0 border-s  rounded-e hover:bg-slate-900 transition-colors duration-300"
            >
              Next
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

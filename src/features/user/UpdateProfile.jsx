import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetSingleUserQuery, useUpdateUserMutation } from "../user/userApi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { BeatLoader } from "react-spinners";

const UpdateProfile = () => {
  const { id } = useAuth();  
  const { data, isLoading } = useGetSingleUserQuery(id);
  const [updateUser] = useUpdateUserMutation()
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: data?.user.username,
    email: data?.user.email,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Do you want to save the changes?",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Save",
        denyButtonText: "Don't Save",
        width: "27rem",
        customClass: {
          confirmButton:
            "!py-1 !px-4 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          cancelButton:
            "!py-1 !px-4 !bg-gray-600 !hover:bg-red-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          denyButton:
            "!py-1 !px-3 !bg-red-600 !hover:bg-red-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });

      if (result.isConfirmed) {
        const {username, email} = user;
        const res = await updateUser({ id, username, email});
        if (res.error) {
          Swal.fire({
            title: "Error!",
            text: res.error.data.message,
            width: "27rem",
            customClass: {
              title: "!text-red-500 !font-bold",
              confirmButton:
                "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
            },
          });
        } else {
          toast.success(res.data.message);
          navigate("/profile");
          setUser({
            username: "",
            email: "",
          })
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: "Changes are not saved!",
          width: "27rem",
          customClass: {
            title: "!font-bold mt-5",
            confirmButton:
              "!py-1 !px-8 !mb-5 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occured on the server!",
        icon: "error",
        width: "27rem",
        customClass: {
          title: "!text-red-500 !font-bold",
          confirmButton:
            "!py-1 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
        },
      });
    }
  };


  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen mt-[-60px]">
      <div className="w-[90%] flex flex-col items-center justify-center  py-6 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Profile Update
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* NAME */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Name
                </label>
                <input
                  type="username"
                  name="username"
                  id="username"
                  value={user.username}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={user.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>

              <button
                type="submit"
                className="transition-colors duration-300 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Update your profile
              </button>

              <Link to={"/profile"}>
                <button className="mt-3 w-full transition-colors duration-300 text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Cancel
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;

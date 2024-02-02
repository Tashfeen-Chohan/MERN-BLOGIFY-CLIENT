import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen mt-[-60px]">
      <div className="w-[90%] flex flex-col items-center justify-center  py-6 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-5 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CURRENT PASSWORD */}
              <div className="relative">
                <label
                  htmlFor="currentPassword"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Current Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button className="absolute right-5 top-9">
                  {!showPassword ? (
                    <IoIosEyeOff
                      onClick={togglePasswordVisibility}
                      color="white"
                      size={18}
                    />
                  ) : (
                    <IoIosEye
                      onClick={togglePasswordVisibility}
                      color="white"
                      size={18}
                    />
                  )}
                </button>
              </div>
              {/* NEW PASSWORD */}
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button className="absolute right-5 top-9">
                  {!showPassword ? (
                    <IoIosEyeOff
                      onClick={togglePasswordVisibility}
                      color="white"
                      size={18}
                    />
                  ) : (
                    <IoIosEye
                      onClick={togglePasswordVisibility}
                      color="white"
                      size={18}
                    />
                  )}
                </button>
              </div>
              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-600"
                />
                <button className="absolute right-5 top-9">
                  {!showPassword ? (
                    <IoIosEyeOff
                      onClick={togglePasswordVisibility}
                      color="white"
                      size={18}
                    />
                  ) : (
                    <IoIosEye
                      onClick={togglePasswordVisibility}
                      color="white"
                      size={18}
                    />
                  )}
                </button>
              </div>

              <div className="flex justify-end items-center gap-3">
                <button
                  type="submit"
                  className=" transition-colors duration-300 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-4 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Save Password
                </button>

                <Link to={"/profile"}>
                  <button className="transition-colors duration-300 text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-3 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
            <p className="text-slate-50 text-sm">
              Password must : <br />
              - include lower and upper case characters <br />
              - include atleast 1 number <br />
              - be atleast 5 characters long <br />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useChangePasswordMutation } from "./userApi";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";
import axios from "axios";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  const [changePassword] = useChangePasswordMutation();
  const { id } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const toggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNewPassword = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
  
    // Check if password meets the specified criteria
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const minLength = 5;
  
    const isLowerCasePresent = lowerCaseRegex.test(newPassword);
    const isUpperCasePresent = upperCaseRegex.test(newPassword);
    const isNumberPresent = numberRegex.test(newPassword);
    const isLengthValid = newPassword.length >= minLength;
  
    setIsPasswordValid(
      isLowerCasePresent && isUpperCasePresent && isNumberPresent && isLengthValid
    );
  }

  const handleLogout = async () => {
    try {
      const res = await axios.post("https://mern-blogify-server.vercel.app/auth/logout");
      dispatch(logout());
      // Clear the "jwt" cookie on the client side
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPassword && newPassword && confirmPassword) {
      try {
        const res = await changePassword({
          id,
          currentPassword,
          newPassword,
          confirmPassword,
        });
        console.log(res);
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
          toast.success(res.data.message, {
            autoClose: 5000
          });
          handleLogout()
          navigate("/login")
        }
      } catch (error) {
        toast.error("An unexpected error occurred on the server side!");
        console.log(error.message);
      }
    } else {
      toast.error("Please fill up all fields!");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex justify-center min-h-screen mt-[-50px] md:mt-[-20px] items-center ">
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
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button type="button" className="absolute right-5 top-9">
                  {!showCurrentPassword ? (
                    <IoIosEyeOff
                      onClick={toggleCurrentPassword}
                      color="gray"
                      size={18}
                    />
                  ) : (
                    <IoIosEye
                      onClick={toggleCurrentPassword}
                      color="gray"
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
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  value={newPassword}
                  onChange={handleNewPassword}
                  className={`${isPasswordValid ? 'border-2 focus:border-green-500 dark:focus:border-green-500' : 'border-2 focus:border-red-500 dark:focus:border-red-500'} outline-none bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                />
                <button type="button" className="absolute right-5 top-9">
                  {!showNewPassword ? (
                    <IoIosEyeOff
                      onClick={toggleNewPassword}
                      color="gray"
                      size={18}
                    />
                  ) : (
                    <IoIosEye
                      onClick={toggleNewPassword}
                      color="gray"
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
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${newPassword === confirmPassword ? 'border-2 focus:border-green-500 dark:focus:border-green-500' : 'border-2 focus:border-red-500 dark:focus:border-red-500'} outline-none bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                />
                <button type="button" className="absolute right-5 top-9">
                  {!showConfirmPassword ? (
                    <IoIosEyeOff
                      onClick={toggleConfirmPassword}
                      color="gray"
                      size={18}
                    />
                  ) : (
                    <IoIosEye
                      onClick={toggleConfirmPassword}
                      color="gray"
                      size={18}
                    />
                  )}
                </button>
              </div>

              <div className="flex justify-end items-center gap-3">
                <button className=" transition-colors duration-300 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-4 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Save Password
                </button>

                  <button type="button"  onClick={() => navigate(-1)} className="transition-colors duration-300 text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-3 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Cancel
                  </button>
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

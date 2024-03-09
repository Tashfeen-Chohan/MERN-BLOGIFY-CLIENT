import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddUserMutation } from "../user/userApi";
import Swal from "sweetalert2";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import app from "../../firebase";
import { v4 } from "uuid";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { BarLoader } from "react-spinners";
import { FaRegEdit } from "react-icons/fa";

const Register = () => {
  const [addUser] = useAddUserMutation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showProfile, setShowProfile] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  
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

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowProfile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file) => {
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `UserProfiles/${file.name + v4()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      toast.error("Error uploading file : ", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && email && password) {
      setLoading(true);
      if (profile) {
        var downloadURL = await uploadFile(profile);
      }
      try {
        const res = await addUser({
          username,
          email,
          password,
          profile: downloadURL,
        });
        if (res.error) {
          Swal.fire({
            title: "Error!",
            text: res.error.data.message,
            width: "27rem",
            customClass: {
              title: "!text-red-500 !font-bold",
              confirmButton:
                "!py-2 !px-8 !bg-blue-600 !hover:bg-blue-700 !transition-colors !duration-500 !text-white !rounded !shadow-xl",
            },
          });
        } else {
          toast.success(res.data.message);
          navigate("/login");
        }
      } catch (error) {
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
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill up all fields!");
    }
  };

  const profileCancel = () => {
    setProfile(null);
    setShowProfile(null);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen">
      <div className="mt-[-60px] md:mt-0 flex flex-col items-center justify-center py-6 mx-auto w-[90%]">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              New Registration
            </h1>
            {showProfile && (
              <div className="relative">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mx-auto">
                  <img
                    src={showProfile}
                    alt="User Profile"
                    className="w-full h-full object-cover text-white text-center"
                  />
                </div>
                <div className="absolute top-0 right-10 md:right-20 flex gap-2">
                  <div>
                    <label htmlFor="profileEdit">
                      <FaRegEdit
                        className="hover:scale-110 transition-all duration-300"
                        color="gray"
                        size={22}
                      />
                    </label>
                    <input
                      onChange={handleProfileChange}
                      id="profileEdit"
                      type="file"
                      className="hidden"
                    />
                  </div>
                  <MdCancel
                    className="hover:scale-110 transition-all duration-300"
                    onClick={profileCancel}
                    color="gray"
                    size={25}
                  />
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* USERNAME */}
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
              {/* PASSWORD */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePassword}
                  className={`${isPasswordValid ? 'border-2 focus:border-green-500 dark:focus:border-green-500' : 'border-2 focus:border-red-500 dark:focus:border-red-500'} outline-none bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                  
                />
                <button type="button" className="absolute right-5 top-10">
                  {!showPassword ? (
                    <IoIosEyeOff
                      onClick={toggleShowPassword}
                      color="gray"
                      size={18}
                    />
                  ) : (
                    <IoIosEye
                      onClick={toggleShowPassword}
                      color="gray"
                      size={18}
                    />
                  )}
                </button>
              </div>
              {/* PROFILE */}
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="profile"
                >
                  Profile
                </label>
                <input
                  className="text-gray-900 dark:text-white"
                  type="file"
                  onChange={handleProfileChange}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className=" w-full text-white disabled:bg-blue-800 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? <BarLoader color="white"/> : "Create an account"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?
                <Link
                  to={"/login"}
                  className="ml-2 font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
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

export default Register;

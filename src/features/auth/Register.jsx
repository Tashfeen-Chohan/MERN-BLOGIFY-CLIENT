import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddUserMutation } from "../user/userApi";
import Swal from "sweetalert2";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../firebase";
import { v4 } from "uuid";

const Register = () => {
  const [addUser] = useAddUserMutation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(undefined);
  const [uploadedImg, setUploadedImg] = useState(undefined);

  const uploadFile = async (file) => {
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `UserProfiles/${file.name + v4()}`);
      const snapshot = await uploadBytes(storageRef, file);
      toast.success("Profile uploaded successfully!");
      try {
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("DownloadURL - ", downloadURL);
        setUploadedImg(downloadURL);
      } catch (error) {
        toast.error("Error getting download URL : ", error.code);
      }
    } catch (error) {
      toast.error("Error uploading file : ", error);
    }
  };

  useEffect(() => {
    if (profile && !uploadedImg) {
      uploadFile(profile);
    }
  }, [profile, uploadedImg]);

  useEffect(() => {
    if (uploadedImg) {
      setProfile(uploadedImg);
    }
  }, [uploadedImg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && email && password) {
      try {
        const res = await addUser({
          username,
          email,
          password,
          profile
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
      }
    } else {
      toast.error("Please fill up all fields!");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen">
      <div className="mt-[-60px] md:mt-0 flex flex-col items-center justify-center py-6 mx-auto w-[90%]">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              New Registration
            </h1>
            {profile && (
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mx-auto">
                <img
                  src={profile}
                  alt="User Profile"
                  className="w-full h-full object-cover text-white text-center"
                />
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
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
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
                  onChange={(e) => setProfile(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;

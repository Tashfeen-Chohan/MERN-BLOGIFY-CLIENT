import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetSingleUserQuery, useUpdateUserMutation } from "../user/userApi";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { BarLoader, BeatLoader } from "react-spinners";
import axios from "axios";
import { logout } from "../auth/authSlice";
import { useDispatch } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import app from "../../firebase";
import { v4 } from "uuid";

const UpdateProfile = () => {
  const { slug } = useAuth();
  const { data, isLoading } = useGetSingleUserQuery(slug);
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showProfile, setShowProfile] = useState(undefined);
  const [editLoading, setEditLoading] = useState(false);
  const defaultProfile =
    "https://firebasestorage.googleapis.com/v0/b/mern-blogify.appspot.com/o/UserProfiles%2Fcowboy.png?alt=media&token=75c80891-40de-464b-a2da-0bb0af3fa08a";

  const [user, setUser] = useState({
    username: data?.user.username,
    email: data?.user.email,
    profile: data?.user.profile,
    prevProfile: data?.user.profile,
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

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      user.profile = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowProfile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("https://mern-blogify-server.vercel.app/auth/logout");
      // toast.success(res.data.message);
      dispatch(logout());
      navigate("/login");
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

  const deleteProfile = async (fileRef) => {
    try {
      const storage = getStorage(app);
      const fileStorageRef = ref(storage, fileRef);
      await deleteObject(fileStorageRef);
    } catch (error) {
      toast.error("Error deleting file: ", error);
      console.error("Error deleting file: ", error);
    }
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
        setEditLoading(true);
        if (!user.profile) {
          user.profile = defaultProfile;
          await deleteProfile(user.prevProfile)
        }
        if (showProfile) {
          const downloadURL = await uploadFile(user.profile);
          user.profile = downloadURL;
          await deleteProfile(user.prevProfile)
        }
       
        const { username, email, profile } = user;
        const res = await updateUser({ slug, username, email, profile });
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
          handleLogout();
          setUser({
            username: "",
            email: "",
            profile: "",
          });
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
    } finally {
      setEditLoading(false);
    }
  };

  const profileCancel = () => {
    setUser((prevState) => ({
      ...prevState,
      profile: null,
    }));
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen mt-[-20px]">
      <div className="w-[90%] flex flex-col items-center justify-center  py-6 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Profile Update
            </h1>
            {user.profile && (
              <div className="relative">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mx-auto">
                  {showProfile ? (
                    <img
                      src={showProfile}
                      alt="Profile"
                      className="w-full h-full object-cover text-white text-center"
                    />
                  ) : (
                    <img
                      src={data?.user.profile}
                      alt="Profile"
                      className="w-full h-full object-cover text-white text-center"
                    />
                  )}
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
                  <button disabled={user.profile === defaultProfile}>
                    <MdCancel
                      className="hover:scale-110 transition-all duration-300"
                      onClick={profileCancel}
                      color="gray"
                      size={25}
                    />
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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
              {/* PROFILE */}
              {!user.profile && (
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
              )}

              <p className="text-yellow-300 text-sm">
                * You would have to Login again with new credentials!
              </p>

              <button
                type="submit"
                disabled={editLoading}
                className="disabled:bg-blue-800 transition-colors duration-300 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {editLoading ? (
                  <BarLoader color="white" />
                ) : (
                  "Update your profile"
                )}
              </button>

              <Link to={-1}>
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

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useGetSingleUserQuery, useUpdateUserMutation } from "./userApi";
import { ROLES } from "../../config/roles";
import { BeatLoader } from "react-spinners";

const UpdateUser = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetSingleUserQuery(slug);
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    profile: "",
    roles: [],
  });

  useEffect(() => {
    if (data) {
      setUser({
        username: data.user.username,
        email: data.user.email,
        profile: data.user.profile,
        roles: data.user.roles,
      });
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setUser({
      ...user,
      roles: values,
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
        const { username, email, roles } = user;
        const res = await updateUser({ slug, username, email, roles });
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
          navigate("/users");
          setUser({
            username: "",
            email: "",
            roles: [],
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
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900  mt-0">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Account Update
            </h1>
            <div className="my-5 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto">
              <img
                src={user.profile}
                alt="User Profile"
                className="w-full h-full rounded-full object-cover text-black text-center"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* USERNAME */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="username"
                  name="username"
                  id="username"
                  value={user.username}
                  onChange={handleChange}
                  disabled
                  className="disabled:text-gray-500 disabled:dark:text-gray-400 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  // placeholder="John Doe"
                />
              </div>
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={user.email}
                  onChange={handleChange}
                  disabled
                  className="disabled:text-gray-600 disabled:dark:text-gray-400 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  // placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="roles"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Assigned Roles
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="roles"
                  id="roles"
                  multiple
                  size={3}
                  value={user.roles}
                  onChange={onRolesChanged}
                >
                  {options}
                </select>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Update
              </button>
              <Link to={"/users"}>
                <button className="mt-2 w-full text-white bg-red-600 hover:bg-red-700 transition-colors duration-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
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

export default UpdateUser;

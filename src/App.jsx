import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./features/auth/Register";
import Categories from "./features/category/Categories";
import AddCategory from "./features/category/AddCategory";
import { ToastContainer } from "react-toastify";
import UpdateCategory from "./features/category/UpdateCategory";
import Users from "./features/user/Users";
import UpdateUser from "./features/user/UpdateUser";
import Nav from "./components/Navbar";
import Login from "./features/auth/Login";
import SingleCategory from "./features/category/SingleCategory";
import SingleUser from "./features/user/SingleUser";
import Profile from "./features/user/Profile";
import UpdateProfile from "./features/user/UpdateProfile";

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* AUTH ROURES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CATEGORIES ROUTES */}
        <Route path="/categories" element={<Categories/>} />
        <Route path="/categories/new" element={<AddCategory />} />
        <Route path="/categories/single/:id" element={<SingleCategory />} />
        <Route path="/categories/update/:id" element={<UpdateCategory />} />

        {/* USERS ROUTES */}
        <Route path="/users" element={<Users/>}/>
        <Route path="/users/update/:id" element={<UpdateUser/>}/>
        <Route path="/users/single/:id" element={<SingleUser/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/profile/edit" element={<UpdateProfile/>}/>
      </Routes>
    </div>
  );
};

export default App;

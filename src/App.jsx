import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Categories from "./features/category/Categories";
import AddCategory from "./features/category/AddCategory";
import { ToastContainer } from "react-toastify";
import UpdateCategory from "./features/category/UpdateCategory";
import Navbar from "./components/Navbar";
import CategoryPage from "./pages/CategoryPage";
import Users from "./features/user/Users";

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CATEGORIES ROUTES */}
        <Route path="/categories" element={<Categories/>} />
        <Route path="/categories/new" element={<AddCategory />} />
        <Route path="/categories/:id" element={<UpdateCategory />} />

        {/* USERS ROUTES */}
        <Route path="/users" element={<Users/>}/>
      </Routes>
    </div>
  );
};

export default App;

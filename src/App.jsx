import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./features/auth/Register";
import Categories from "./features/category/Categories";
import AddCategory from "./features/category/AddCategory";
import { ToastContainer } from "react-toastify";
import UpdateCategory from "./features/category/UpdateCategory";
import Users from "./features/user/Users";
import UpdateUser from "./features/user/UpdateUser";
import Login from "./features/auth/Login";
import SingleCategory from "./features/category/SingleCategory";
import SingleUser from "./features/user/SingleUser";
import Profile from "./features/user/Profile";
import UpdateProfile from "./features/user/UpdateProfile";
import ChangePassword from "./features/user/ChangePassword";
import CreatePost from "./features/post/CreatePost";
import SinglePost from "./features/post/SinglePost";
import Posts from "./features/post/Posts";
import UpdatePost from "./features/post/UpdatePost";
import MyPosts from "./features/post/MyPosts";
import Dashboard from "./components/Dashboard";
import AllComments from "./features/comment/AllComments";
import Layout from "./components/Layout";
import useAuth from "./hooks/useAuth";
import PageNotFound from "./components/PageNotFound";
import About from "./components/About";

const App = () => {
  const {isAdmin, isPublisher, status} = useAuth()
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

      <Layout>
        <Routes>

          {/* PUBLIC ROURES */}
          <Route path="/" element={<Posts />} />
          <Route path="/about-me" element={<About/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Login/>} />
          <Route path="/all-comments" element={isAdmin ? <AllComments /> : <Login/>} />

          {/* CATEGORIES ROUTES */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/new" element={isPublisher ? <AddCategory /> : <Login/>} />
          <Route path="/categories/:slug" element={<SingleCategory />} />
          <Route path="/categories/update/:slug" element={isAdmin ? <UpdateCategory /> : <Login/>} />

          {/* USERS ROUTES */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/:slug" element={<SingleUser />} />
          <Route path="/users/update/:slug" element={isAdmin ? <UpdateUser /> : <Login/>} />
          <Route path="/profile/:slug" element={status !== "" ? <Profile /> : <Login/>} />
          <Route path="/profile/:slug/edit" element={status !== "" ? <UpdateProfile /> : <Login/>} />
          <Route path="/profile/:slug/change-password" element={status !== "" ? <ChangePassword /> : <Login/>} />

          {/* POST ROUTES */}
          <Route path="/posts/new" element={isPublisher ? <CreatePost /> : <Login/>} />
          <Route path="/posts/my-posts/:username" element={isPublisher ? <MyPosts /> : <Login/>} />
          <Route path="/posts/:slug" element={<SinglePost />} />
          <Route path="/posts/update/:slug" element={isPublisher ? <UpdatePost /> : <Login/>} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Layout>
    </div>
  );
};

export default App;

import React from 'react'
import { useGetUsersQuery } from '../features/user/userApi'
import { TbUsersGroup } from "react-icons/tb";
import { RiArticleLine } from "react-icons/ri";
import { useGetPostsQuery } from '../features/post/postApi';
import { BeatLoader } from 'react-spinners';
import { LiaComments } from "react-icons/lia";
import { useGetAllCommentsQuery } from '../features/comment/commentApi';
import { useGetCategoriesQuery } from '../features/category/categoryApi';
import { BiCategoryAlt } from "react-icons/bi";

const Dashboard = () => {

  const {data: Users, isLoading} = useGetUsersQuery('/users')
  const {data: Posts, isLoading: postLoading} = useGetPostsQuery('/posts')
  const {data: Comments, isLoading: comLoading} = useGetAllCommentsQuery('/comments')
  const {data: Categories, isLoading: catLoading} = useGetCategoriesQuery("/categories")

  if (isLoading || postLoading || comLoading || catLoading)
    return (
      <div className="flex justify-center items-center min-h-screen mt-[-60px] bg-slate-200">
        <BeatLoader color="#000000" size={15} />
      </div>
    );


  return (
    <div>
      <div className='w-[95%] md:max-w-4xl mx-auto grid grid-cols-12 gap-3 mt-10'>
        {/* USERS */}
        <div className='col-span-6 md:col-span-3 py-4 md:py-5 shadow-xl rounded bg-purple-500 text-gray-100 flex justify-center items-center gap-5'>
          <TbUsersGroup size={50}/>
          <div className='flex justify-center items-center flex-col'>
            <p className='text-xl font-bold'>{Users?.totalUsers}</p>
            <p>Users</p>
          </div>
        </div>
        {/* POSTS */}
        <div className='col-span-6 md:col-span-3 py-4 shadow-xl rounded bg-sky-500 text-gray-100 flex justify-center items-center gap-5'>
          <RiArticleLine size={50}/>
          <div className='flex justify-center items-center flex-col'>
            <p className='text-xl font-bold'>{Posts?.totalPosts}</p>
            <p>Posts</p>
          </div>
        </div>
        {/* COMMENTS */}
        <div className='col-span-6 md:col-span-3 py-4 shadow-xl rounded bg-yellow-500 text-gray-100 flex justify-center items-center gap-5'>
          <LiaComments size={50}/>
          <div className='flex justify-center items-center flex-col'>
            <p className='text-xl font-bold'>{Comments?.length}</p>
            <p>Comments</p>
          </div>
        </div>
        {/* CATEGORIES */}
        <div className='col-span-6 md:col-span-3 py-4 shadow-xl rounded bg-rose-500 text-gray-100 flex justify-center items-center gap-5'>
          <BiCategoryAlt size={50}/>
          <div className='flex justify-center items-center flex-col'>
            <p className='text-xl font-bold'>{Categories?.totalCategories}</p>
            <p>Categories</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

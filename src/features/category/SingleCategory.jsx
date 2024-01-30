import React from 'react'
import { useGetSingleCategoryQuery } from './categoryApi'
import { Link, useParams } from 'react-router-dom'
import { TiArrowBack } from "react-icons/ti";


const SingleCategory = () => {

  const {id} = useParams()
  const {data} = useGetSingleCategoryQuery(id)
  

  return (
    <div className='flex justify-center items-center min-h-screen mt-[-60px]'>
      <div className='flex justify-start items-start flex-col bg-slate-100 px-5 pt-3 pb-7  rounded shadow-md w-[80%] md:pt-5 md:max-w-sm'>
      <Link to={"/categories"} className="flex self-end">
        <TiArrowBack size={40}/>
        </Link>
        <h1 className='text-xl font-bold flex  pb-3 mt-3 md:text-2xl'>Category Information</h1>
        <h2>Category Name : <span className='font-semibold'>{data?.capitalized.name}</span></h2>
        <p>No. of Posts : <span className='font-semibold'>{data?.totalPosts}</span></p>
        {data?.totalPosts > 0 && <div className="flex justify-center items-center mt-4 w-full">
            <button className="bg-slate-700 hover:bg-slate-800 transition-colors duration-300 text-white py-1 px-5 rounded  mt-3">
              View Posts
            </button>
          </div>}
      </div>
    </div>
  )
}

export default SingleCategory

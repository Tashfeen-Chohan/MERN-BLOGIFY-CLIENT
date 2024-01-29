import React from 'react'
import { useGetSingleCategoryQuery } from './categoryApi'
import { Link, useParams } from 'react-router-dom'

const SingleCategory = () => {

  const {id} = useParams()
  const {data} = useGetSingleCategoryQuery(id)
  

  return (
    <div className='flex justify-center items-center'>
      <div className='flex justify-start items-start flex-col bg-slate-100 px-5 py-3 mt-28 rounded shadow-md w-[80%] md:pt-5 md:max-w-sm'>
        <h1 className='text-xl font-bold flex self-center pb-3 md:text-2xl'>Category Information</h1>
        <h2>Category Name : <span className='font-semibold'>{data?.capitalized.name}</span></h2>
        <p>No. of Posts : <span className='font-semibold'>{data?.totalPosts}</span></p>
        <div className='flex justify-center items-center gap-3 self-center mt-2'>
        <button className='bg-slate-700 text-white py-1 px-3 rounded  mt-3'>View Posts</button>
        <button className='bg-blue-600 text-white py-1 px-3 rounded  mt-3'><Link to={"/categories"}>Go Back</Link></button>

        </div>
      </div>
    </div>
  )
}

export default SingleCategory

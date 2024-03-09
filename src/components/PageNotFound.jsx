import React from 'react'
import Error from "../assets/errorImg.webp"
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <div className='flex justify-center items-center h-screen mt-[-60px]'>
      <div className='md:max-w-4xl'>
        <img onClick={() => navigate("/")} src={Error} alt="Page not found!" />
      </div>
    </div>
  )
}

export default PageNotFound

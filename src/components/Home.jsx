import React from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../features/auth/authSlice'
import useAuth from '../hooks/useAuth'

const Home = () => {

  const {status, isPublisher, isAdmin} = useAuth()
  console.log(status)
  

  return (
    <div>
      <ul>
        <li>Status : {status}</li>
      </ul>
    </div>
  )
}

export default Home

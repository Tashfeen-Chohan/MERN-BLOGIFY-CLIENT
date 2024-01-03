import React from 'react'
import { useGetUsersQuery } from './userApi'

const Users = () => {

  const url = "users"
  const {data, isloading, isError, error} = useGetUsersQuery(url)
  console.log(data)


  return (
    <div className='mt-20'>
      Users
    </div>
  )
}

export default Users

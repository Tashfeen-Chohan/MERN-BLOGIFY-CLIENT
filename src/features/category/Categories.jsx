import React from 'react'
import { useGetCategoriesQuery } from './categoryApi'

const Categories = () => {

  const {data} = useGetCategoriesQuery()
  console.log(data)

  return (
    <div>
      
    </div>
  )
}

export default Categories

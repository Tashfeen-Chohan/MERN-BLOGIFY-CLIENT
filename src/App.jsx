import React from 'react'
import "./App.css"
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Categories from './features/category/Categories'
import AddCategory from './features/category/AddCategory'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/categories/new' element={<AddCategory/>}/>
      </Routes>
    </div>
  )
}

export default App

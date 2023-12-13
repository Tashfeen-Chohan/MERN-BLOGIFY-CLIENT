import React from 'react'
import "./App.css"
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Categories from './features/category/Categories'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/categories' element={<Categories/>}/>
      </Routes>
    </div>
  )
}

export default App

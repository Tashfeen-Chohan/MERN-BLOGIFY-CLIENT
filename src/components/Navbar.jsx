import React from 'react'

const Navbar = ({showSidebar, setShowSidebar}) => {

  return (
    <nav className='z-20 flex justify-between items-center bg-slate-800 text-white py-4 px-7 shadow-xl fixed w-full'>
      <div className='flex gap-4 items-center flex-row-reverse md:flex-row'>
        <h2>Blogify</h2>
        <span className='hidden md:block text-2xl'>#</span>
        <span className='md:hidden text-2xl' onClick={() => setShowSidebar(!showSidebar)}>=</span>
      </div>
      <div className='flex gap-5'>
        <span>Home</span>
        <span>About</span>
        <span>Contant</span>
      </div>
    </nav>
  )
}

export default Navbar

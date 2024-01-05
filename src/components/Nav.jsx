import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";

const Nav = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          Blogify
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          {showNavbar ? <GiCrossMark size={20}/> : <GiHamburgerMenu size={20}/>}
        </div>
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li onClick={handleShowNavbar}>
              <NavLink to="/">Home</NavLink>
            </li>
            <li onClick={handleShowNavbar}>
              <NavLink to="/categories">Categories</NavLink>
            </li>
            <li onClick={handleShowNavbar}>
              <NavLink to="/users">Users</NavLink>
            </li>
          <div className='flex items-center mt-5 md:mt-0 gap-3 md:ml-5 '>
            <Link to={"/register"}>
            <button onClick={handleShowNavbar} className='bg-slate-200 hover:bg-slate-300 transition-all duration-500 border py-[1px] px-2 rounded shadow-xl text-black'>Sign up</button>
            </Link>
            <Link to={"/login"}>
            <button onClick={handleShowNavbar} className='bg-transparent hover:bg-slate-700 hover:border hover:text-white transition-all duration-500 border py-[1px] px-3 rounded  shadow-xl'>Login</button>
            </Link>
          </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav
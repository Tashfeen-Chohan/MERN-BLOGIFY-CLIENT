import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiCrossMark } from "react-icons/gi";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  return (
    <>
      <nav className="fixed top-0 z-10 w-full flex flex-wrap items-center px-2 py-3 bg-slate-800 text-white shadow-xl">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-center">
          <div className="md:pl-28 w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            {/* LOGO */}
            <Link to={"/"}>
                <span className="text-xl font-bold italic md:text-2xl">Blogify</span>
            </Link>

            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              {navbarOpen ? <GiCrossMark /> : <GiHamburgerMenu />}
            </button>
          </div>

          {/* NAV LIKS */}
          <div
            className={
              "lg:flex flex-grow items-center md:pr-28" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="px-3 py-2 flex items-center text-xs md:text-lg uppercase leading-snug text-white hover:opacity-75"
              >
                <Link to={"/categories"}>CATEGORIES</Link>
              </li>
              <li
                onClick={() => setNavbarOpen(!navbarOpen)}
                className="px-3 py-2 flex items-center text-xs md:text-lg uppercase leading-snug text-white hover:opacity-75"
              >
                <Link to={"/users"}>USERS</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

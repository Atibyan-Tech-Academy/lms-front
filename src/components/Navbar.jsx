import React from 'react'
import logo from "../assets/aoi-portal.png"
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-40 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/login" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-10" alt="AOI Portal Logo" />
           
          </a>

          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
             <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
            
          </div>

         
        </div>
      </nav>
    </div>
  )
}

export default Navbar
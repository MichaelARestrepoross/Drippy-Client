import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/drippylogo.png';
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/homepage');
    setIsOpen(false);
  };

  const handleNavigateLanding = () => {
    navigate('/');
    setIsOpen(false);
  };

  const handleNavigateProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleNavigateAbout = () => {
    navigate('/about');
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <header className="bg-gray-50 overflow-hidden z-10 relative border-b-4 border-gray-500 shadow-dark-lg">
      <div className="flex justify-between items-center h-full max-w-screen-xl px-6 mx-auto relative z-10">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="logo-img h-24 w-auto transform transition-transform duration-300 hover:scale-130 cursor-pointer"
            onClick={handleNavigateLanding} 
          />
        </div>
        <div className="hidden nav-buttons md:flex items-center gap-4">
          <button
            onClick={handleNavigateHome}
            className="flex items-center text-2xl text-gray-700 bg-transparent border-none cursor-pointer transform transition-transform duration-300 ease-in-out hover:text-purple-600 hover:scale-150"
          >
            <span className="mr-2">Home</span>
          </button>
          <button
            onClick={handleNavigateProfile}
            className="ml-1 mr-1 flex items-center text-2xl text-gray-700 bg-transparent border-none cursor-pointer transform transition-transform duration-300 ease-in-out hover:text-purple-600 hover:scale-150"
          >
            <span className="mr-2">Profile</span>
          </button>
          <button
            onClick={handleNavigateAbout}
            className="flex items-center text-2xl text-gray-700 bg-transparent border-none cursor-pointer transform transition-transform duration-300 ease-in-out hover:text-purple-600 hover:scale-150"
          >
            <span className="mr-2">About</span>
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleDropdown} className="bg-gray-50 text-gray-800 hover:text-purple-600 focus:outline-none">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-50 shadow-md">
          <button onClick={handleNavigateHome} className="text-center block w-full text-left px-4 py-2 text-gray-800 bg-gray-50 hover:bg-gray-100 hover:text-purple-600">
            Home
          </button>
          <button onClick={handleNavigateProfile} className="text-center block w-full text-left px-4 py-2 text-gray-800 bg-gray-50 hover:bg-gray-100 hover:text-purple-600">
            Profile
          </button>
          <button onClick={handleNavigateProfile} className="text-center block w-full text-left px-4 py-2 bg-gray-50 text-gray-800 hover:bg-gray-100 hover:text-purple-600">
            About Us
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

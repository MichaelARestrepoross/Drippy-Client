import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/drippylogo.png';
import "./Header.css"

const Header = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/homepage');
  };

  const handleNavigateWardrobe = () => {
    navigate('/wardrobe');
  };

  const handleNavigateLanding = () => {
    navigate('/landingpage');
  };
  const handleNavigateProfile = () => {
    navigate('/profile');
  };


  return (
    <header className="bg-white-400 shadow h-20"> 
      <div className="container mx-auto px-6 flex justify-between items-center h-full">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto logo-img" onClick={handleNavigateLanding}/> 
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleNavigateHome}
            className="home-nav flex items-center text-gray-800 hover:text-purple-600 text-xl bg-transparent"
          >
            <span className="icon-placeholder-home mr-2">🏠</span>
          </button>
          <button
            onClick={handleNavigateProfile}
            className="profile-nav flex items-center text-gray-800 hover:text-purple-600 text-xl bg-transparent"
          >
            <span className="icon-placeholder-clothing mr-2">👤</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

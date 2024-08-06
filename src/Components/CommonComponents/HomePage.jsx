import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import goopVideo from '../../assets/goop.mp4';
import logo from '../../assets/drippylogo.png';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen home-wrapper">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src={goopVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="welcome-wrapper relative z-10 flex flex-col items-center shadow-dark-lg">
        <img src={logo} alt="Logo" />
        <div className="home-buttons-wrapper w-full max-w-lg flex flex-col items-center space-y-4">
          <button 
            onClick={() => handleNavigation('/wardrobe')}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300 shadow-dark-lg"
          >
            Go to Wardrobe
          </button>
          <button 
            onClick={() => handleNavigation('/addclothing')}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300 shadow-dark-lg"
          >
            Add clothing
          </button>
          <button 
            onClick={() => handleNavigation('/generateoutfit')}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300 shadow-dark-lg"
          >
            Generate Today's Outfit
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

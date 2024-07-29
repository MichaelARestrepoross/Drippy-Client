import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import goopVideo from '../../assets/goop.mp4';

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
      <div className="welcome-wrapper relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-purple-700">Welcome to Drippy</h1>
        <div className="space-y-4 sm:space-x-0 sm:flex sm:flex-col">
          <button 
            onClick={() => handleNavigation('/wardrobe')}
            className="w-64 py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300"
          >
            Go to Wardrobe
          </button>
          <button 
            onClick={() => handleNavigation('/addclothing')}
            className="w-64 py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300"
          >
            Add clothing
          </button>
          <button 
            onClick={() => handleNavigation('/generateoutfit')}
            className="w-64 py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300"
          >
            Generate Today's Outfit
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

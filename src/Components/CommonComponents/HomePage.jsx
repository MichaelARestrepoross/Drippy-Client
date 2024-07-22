import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-100">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">Welcome to Drippy</h1>
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:flex-row">
        <button 
          onClick={() => handleNavigation('/wardrobe')}
          className="w-64 py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300"
        >
          Go to Wardrobe
        </button>
        <button 
          onClick={() => handleNavigation('/getlocation')}
          className="w-64 py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300"
        >
          Add Location
        </button>
        <button 
          onClick={() => handleNavigation('/generateoutfit')}
          className="w-64 py-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition duration-300"
        >
          Generate Today's Outfit
        </button>
      </div>
    </div>
  );
}

export default HomePage;

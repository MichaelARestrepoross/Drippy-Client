import React, { useState } from 'react';

const ClothesCard = ({ id, image_base64, image_url, prompt, color, type_name, material_name, min_temp, max_temp, min_humidity, max_humidity, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);
  const imageUrl = image_url || image_base64;

  const handleToggleDetails = (e) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <div onClick={onClick} className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-dark-lg transform transition-transform duration-300 hover:scale-105 relative">
      <img src={imageUrl} alt={prompt} className="h-80 w-full object-cover" />
      {/* <h3 className="text-xl font-bold mb-2 text-purple-700">{color} {type_name}</h3> */}

      <div className={`absolute inset-0 bg-white bg-opacity-90 p-4 transition-opacity duration-300 ${showDetails ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <h3 className="text-xl font-bold mb-2 text-purple-700">{color} {type_name}</h3>
        <p className="text-gray-600 mb-2">Color: {color}</p>
        <p className="text-gray-600 mb-2">Type: {type_name}</p>
        <p className="text-gray-600 mb-2">Material: {material_name}</p>
        <p className="text-gray-600 mb-2">Temperature Range: {min_temp}°F - {max_temp}°F</p>
        <p className="text-gray-600 mb-2">Humidity: {min_humidity}% - {max_humidity}%</p>
      </div>
      <button
        onClick={handleToggleDetails}
        className={`absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold transition-colors duration-300 ${showDetails ? 'bg-gray-500' : 'bg-purple-500'}`}
      >
        {showDetails ? 'Close Details' : 'Details'}
      </button>
    </div>
  );
};

export default ClothesCard;

import React from 'react';

const ClothesCard = ({ id, image_base64, prompt, color, type_name, material_name, min_temp, max_temp, min_humidity, max_humidity }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <img src={image_base64} alt={prompt} className="h-64 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-purple-700">{prompt}</h3>
        <p className="text-gray-600 mb-2">Color: {color}</p>
        <p className="text-gray-600 mb-2">Type: {type_name}</p>
        <p className="text-gray-600 mb-2">Material: {material_name}</p>
        <p className="text-gray-600 mb-2">Temperature Range: {min_temp}°C - {max_temp}°C</p>
        <p className="text-gray-600 mb-2">Humidity: {min_humidity}% - {max_humidity}%</p>
      </div>
    </div>
  );
};

export default ClothesCard;

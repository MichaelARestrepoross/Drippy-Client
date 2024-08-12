import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ClothesIndex from './ClothesIndex';
import './Wardrobe.css';
import Footer from './CommonComponents/Footer';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


function Wardrobe() {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

  const handleAddClothing = () => {
    navigate('/addclothing');
  };
  const handleGenerateOutfit = () => {
    navigate('/generateoutfit');
  };

  return (
    <div>
    <div className="wardrobe-wrapper bg-purple-300 p-1 py-4">
      <div className="my-clothing-container">
        <h1 className="text-7xl font-bold text-white text-shadow">My Wardrobe</h1>
        <div className="flex button-group gap-4">
          <button
            onClick={handleAddClothing}
            className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition shadow-dark-lg"
          >
            Add New Clothing
          </button>
          <button
            onClick={handleGenerateOutfit}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-white hover:text-purple-600 transition shadow-dark-lg"
          >
            Generate Outfit
          </button>
        </div>
      </div>
      <ClothesIndex 
        selectedType = {selectedType} 
        setSelectedType ={setSelectedType} 
        selectedColor = {selectedColor} 
        setSelectedColor ={setSelectedColor} 
      />
    </div>
    <Footer 
        selectedType = {selectedType} 
        selectedColor = {selectedColor} 
    />
    </div>
  );
}

export default Wardrobe;

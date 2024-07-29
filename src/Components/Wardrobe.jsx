import { useNavigate } from 'react-router-dom';
import ClothesIndex from './ClothesIndex';
import './Wardrobe.css';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // Make sure these are set in your environment
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function Wardrobe() {
  const navigate = useNavigate();

  const handleAddClothing = () => {
    navigate('/addclothing');
  };

  return (
    <div className="pr-6 pl-0 wardrobe-wrapper bg-purple-300">
      <h1 className="text-9xl font-bold mb-4 text-white text-shadow">My Wardrobe</h1>
      <button
        onClick={handleAddClothing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition shadow-dark-lg"
      >
        Add New Clothing
      </button>

    
      <ClothesIndex />
    </div>
  );
}

export default Wardrobe;

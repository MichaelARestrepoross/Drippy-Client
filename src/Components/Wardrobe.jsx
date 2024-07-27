import { useNavigate } from 'react-router-dom';
import ClothesIndex from './ClothesIndex';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // Make sure these are set in your environment
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function Wardrobe() {
  const navigate = useNavigate();

  const handleAddClothing = () => {
    navigate('/addclothing');
  };

  return (
    <div className="pr-6 pl-0">
      <h1 className="text-2xl font-bold mb-4">Wardrobe</h1>
      <button
        onClick={handleAddClothing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Add New Clothing
      </button>

    
      <ClothesIndex />
    </div>
  );
}

export default Wardrobe;

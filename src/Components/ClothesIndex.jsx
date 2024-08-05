import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClothesCard from './ClothesCard';
import FilterBox from './FilterBox';
import ColorFilterModal from './ColorFilterModal';
import UpdateClothes from './UpdateClothes';
import "./ClothesIndex.css"
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ClothesIndex = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedClothingID, setSelectedClothingID] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothes = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No token found. Please log in.', { position: 'bottom-center' });
        setLoading(false);
        navigate("/profile");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/clothes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          navigate("/profile");
          toast.error('Forbidden: Invalid token or access denied.Please log in', { position: 'bottom-center' });
          throw new Error('Forbidden: Invalid token or access denied.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch clothes');
        }

        const data = await response.json();
        const sortedClothes = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        setClothes(sortedClothes);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message, { position: 'bottom-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchClothes();
  }, []);

  const handleFilterClick = (type) => {
    setSelectedType(type);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setIsColorModalOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedType(null);
    setSelectedColor(null);
  };

  const handleCardClick = (clothingID) => {
    setSelectedClothingID(clothingID);
    setIsActionModalOpen(true);
  };

  const handleDeleteClothing = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('No token found. Please log in.', { position: 'bottom-center' });
      navigate("/profile");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/clothes/${selectedClothingID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 403) {
        navigate("/profile");
        throw new Error('Forbidden: Invalid token or access denied.');
      }

      if (!response.ok) {
        throw new Error('Failed to delete clothing');
      }
      
      setClothes(clothes.filter(item => item.clothes_id !== selectedClothingID));
      toast.success('Clothing deleted successfully', { position: 'bottom-center' });
      setIsActionModalOpen(false);
      setSelectedClothingID(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message, { position: 'bottom-center' });
    }
  };

  const colors = [...new Set(clothes.map((item) => item.color))];

  const filteredClothes = clothes.filter((item) => {
    return (!selectedType || item.type_name === selectedType) &&
           (!selectedColor || item.color === selectedColor);
  });

  return (
    <div className="container mx-auto px-8">
      <div className="filters-bar flex items-center justify-center gap-8 mb-6">
        <span
          onClick={() => setIsColorModalOpen(true)}
          className="filter-link"
        >
          Filter by Color
        </span>
        <span
          onClick={handleResetFilters}
          className="filter-link"
        >
          Reset Filters
        </span>
        {['T-shirt', 'Jacket', 'Sweater', 'Shorts', 'Pants', 'Tank-Top', 'Sandals', 'Sneakers', 'Boots', 'Heels', 'Suit','Button-Up Shirt'].map((type) => (
          <span
            key={type}
            onClick={() => handleFilterClick(type)}
            className={`filter-link ${selectedType === type ? 'active' : ''}`}
          >
            {type}
          </span>
        ))}
      </div>
      <ColorFilterModal
        isOpen={isColorModalOpen}
        onRequestClose={() => setIsColorModalOpen(false)}
        colors={colors}
        onColorSelect={handleColorSelect}
      />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredClothes.length === 0 ? (
        <p className="text-center">No results found for {selectedType || 'any type'} {selectedColor || 'color'}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredClothes.map((item) => (
            <ClothesCard key={item.clothes_id} {...item} onClick={() => handleCardClick(item.clothes_id)} />
          ))}
        </div>
      )}

      {isActionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Manage Clothing</h2>
            <button
              onClick={() => {
                setIsActionModalOpen(false);
                setIsUpdateModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 w-full"
            >
              Edit Clothing
            </button>
            <button
              onClick={handleDeleteClothing}
              className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600 w-full"
            >
              Delete Clothing
            </button>
            <button
              onClick={() => setIsActionModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <UpdateClothes
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          clothesId={selectedClothingID}
        />
      )}
    </div>
  );
};

export default ClothesIndex;

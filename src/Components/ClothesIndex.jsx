import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClothesCard from './ClothesCard';
import FilterBox from './FilterBox';
import ColorFilterModal from './ColorFilterModal';
import UpdateClothes from './UpdateClothes';  

const ClothesIndex = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedClothingID, setSelectedClothingID] = useState(null);
  const [isFilterBoxVisible, setIsFilterBoxVisible] = useState(false); // Set to false to hide filters initially
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);  // State for update modal

  useEffect(() => {
    const fetchClothes = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No token found. Please log in.', { position: 'bottom-center' });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3003/api/clothes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          toast.error('Forbidden: Invalid token or access denied.', { position: 'bottom-center' });
          throw new Error('Forbidden: Invalid token or access denied.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch clothes');
        }

        const data = await response.json();

        // Sort clothes by updated_at in descending order
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
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/api/clothes/${selectedClothingID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">Your Clothes</h1>

      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setIsFilterBoxVisible(!isFilterBoxVisible)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow-dark-lg"
        >
          {isFilterBoxVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
        <button
          onClick={() => setIsColorModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-dark-lg"
        >
          Filter by Color
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 shadow-dark-lg"
        >
          Reset Filters
        </button>
      </div>

      {isFilterBoxVisible && (
        <div className="flex justify-center mb-6 flex-wrap gap-4">
          <FilterBox
            type="None"
            onClick={() => handleFilterClick(null)}
            className="bg-gray-200 text-gray-700"
          />
          {['T-shirt', 'Jacket', 'Sweater', 'Shorts', 'Pants', 'Tank-Top', 'Sandals', 'Sneakers', 'Boots', 'Heels'].map((type) => (
            <FilterBox
              key={type}
              type={type}
              onClick={() => handleFilterClick(type)}
              className={`cursor-pointer ${selectedType === type ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            />
          ))}
        </div>
      )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {console.log("filtered clothes index:", filteredClothes)}
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

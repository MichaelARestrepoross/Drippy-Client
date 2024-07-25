import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClothesCard from './ClothesCard';
import FilterBox from './FilterBox';
import ColorFilterModal from './ColorFilterModal';

const ClothesIndex = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

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
        setClothes(data);
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

  const colors = [...new Set(clothes.map((item) => item.color))];

  const filteredClothes = clothes.filter((item) => {
    return (!selectedType || item.type_name === selectedType) &&
           (!selectedColor || item.color === selectedColor);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">Your Clothes</h1>

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

      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setIsColorModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filter by Color
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset Filters
        </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClothes.map((item) => (
            <ClothesCard key={item.clothes_id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClothesIndex;

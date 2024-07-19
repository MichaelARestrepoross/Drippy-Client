import React, { useState } from 'react';
import ClothesForm from './ClothesForm'; // Adjust the import path as needed

function Wardrobe() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wardrobe</h1>
      <button 
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Add New Clothes
      </button>

      <ClothesForm isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Wardrobe;

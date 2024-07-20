import React, { useState } from 'react';
import ClothesForm from './ClothesForm'; // Adjust the import path as needed
import Gemini from './Gemini'; // Adjust the import path as needed

function Wardrobe() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [urlInput, setUrlInput] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    setImageUrl(urlInput);
    openModal();
  };

  const handleProcessedData = (data) => {
    setInitialValues(JSON.parse(data));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wardrobe</h1>
      <form onSubmit={handleUrlSubmit} className="mb-4">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter image URL"
          className="border p-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add New Clothes
        </button>
      </form>

      {imageUrl && <Gemini imageUrl={imageUrl} onProcessed={handleProcessedData} />}
      {isModalOpen && initialValues && (
        <ClothesForm initialValues={initialValues} isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
}

export default Wardrobe;

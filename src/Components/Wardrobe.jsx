import React, { useState } from 'react';
import ClothesForm from './ClothesForm'; // Adjust the import path as needed
import Gemini from './Gemini'; // Adjust the import path as needed
import OpenCamera from './OpenCamera'; // Adjust the import path as needed
import ClothesIndex from './ClothesIndex';

function Wardrobe() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

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

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = 'captured-image.png'; // Name of the file
      link.click(); // Trigger a click to start the download
    }
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

        <ClothesIndex />
      {/* <button
        onClick={() => setIsCameraOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ml-4"
      >
        Open Camera
      </button> */}

      {isCameraOpen && (
        <OpenCamera
          isCameraOpen={isCameraOpen}
          setIsCameraOpen={setIsCameraOpen}
          setCapturedImage={setCapturedImage}
        />
      )}

      {capturedImage && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Captured Image:</h2>
          <img src={capturedImage} alt="Captured" className="w-full max-w-md" />
          <button
            onClick={downloadImage}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition mt-2"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
}

export default Wardrobe;

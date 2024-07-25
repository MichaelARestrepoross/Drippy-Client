import React, { useState } from 'react';
import ClothesForm from './ClothesForm'; 
import Gemini from './Gemini'; 
import OpenCamera from './OpenCamera'; 
import ClothesIndex from './ClothesIndex';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // Make sure these are set in your environment
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function Wardrobe() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState(''); // Store the URL returned from Cloudinary

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

  const handleCapturedImage = (image) => {
    setCapturedImage(image);
    const base64Data = image.split(',')[1];
    setBase64Image(base64Data);
    uploadToCloudinary(base64Data);
  };

  const uploadToCloudinary = async (base64Data) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64Data}`);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setCloudinaryUrl(data.secure_url); // Save the URL in state
        console.log("Uploaded Image URL:", data.secure_url); // Log the URL to the console
        return data.secure_url; // Return the URL
      } else {
        throw new Error(`Failed to upload image: ${data.error ? data.error.message : "Unknown error"}`);
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null; // Return null in case of error
    }
  };


  return (
    <div className="pr-6 pl-0">
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

      <button
        onClick={() => setIsCameraOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ml-4"
      >
        Open Camera
      </button>

      {isCameraOpen && (
        <OpenCamera
          isCameraOpen={isCameraOpen}
          setIsCameraOpen={setIsCameraOpen}
          setCapturedImage={handleCapturedImage}
        />
      )}

      {capturedImage && (
        <div className="mt-4">
          <img src={capturedImage} alt="Captured" className="mb-4 max-w-md" />
          <button
            onClick={downloadImage}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Download Image
          </button>
          {cloudinaryUrl && (
            <div>
              <a href={cloudinaryUrl} target="_blank" rel="noopener noreferrer">View on Cloudinary</a>
            </div>
          )}
        </div>
      )}
      <ClothesIndex />
    </div>
  );
}

export default Wardrobe;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClothesForm from './ClothesForm';
import Gemini from './Gemini';
import OpenCamera from './OpenCamera';
import { ClipLoader } from 'react-spinners';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function ImageHandler() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (cloudinaryUrl) {
      setImageUrl(cloudinaryUrl);
      openModal();
    }
  }, [cloudinaryUrl]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setImageUrl('');
    setUrlInput('');
    setInitialValues(null);
    setCapturedImage(null);
    setCloudinaryUrl('');
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setImageUrl(urlInput);
    openModal();
  };

  const handleProcessedData = (data) => {
    setInitialValues(JSON.parse(data));
    setIsLoading(false);
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = 'captured-image.png';
      link.click();
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
        setCloudinaryUrl(data.secure_url);
        setUrlInput(data.secure_url);
        return data.secure_url;
      } else {
        throw new Error(`Failed to upload image: ${data.error ? data.error.message : "Unknown error"}`);
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        uploadToCloudinary(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a JPG or PNG file.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 to-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-6 bg-white shadow-dark-lg rounded-lg max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Add Clothes</h1>
        
        <form onSubmit={handleUrlSubmit} className="mb-6">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL"
              className="border border-gray-300 p-3 rounded-md w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add New Clothes
            </button>
          </div>
        </form>

        <div className="text-center mb-6">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            className="block mx-auto mb-3 border border-gray-300 p-3 rounded-md w-full"
          />
          <button
            onClick={() => setIsCameraOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition w-full"
          >
            Open Camera
          </button>
        </div>

        {imageUrl && <Gemini imageUrl={imageUrl} onProcessed={handleProcessedData} />}
        
        {isModalOpen && initialValues && (
          <ClothesForm initialValues={initialValues} isOpen={isModalOpen} onClose={closeModal} />
        )}

        {isLoading && (
          <div className="flex justify-center items-center mt-6">
            <ClipLoader color="#4A90E2" size={50} />
          </div>
        )}

        {isCameraOpen && (
          <OpenCamera
            isCameraOpen={isCameraOpen}
            setIsCameraOpen={setIsCameraOpen}
            setCapturedImage={handleCapturedImage}
          />
        )}

        {capturedImage && (
          <div className="text-center mt-6">
            <img src={capturedImage} alt="Captured" className="mb-4 mx-auto max-w-full border border-gray-300 rounded-md" />
            <button
              onClick={downloadImage}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition w-full"
            >
              Download Image
            </button>
            {cloudinaryUrl && (
              <div className="mt-3">
                <a href={cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on Cloudinary</a>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/wardrobe')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition w-full"
          >
            Go to Wardrobe
          </button>
        </div>
      </div>
    </div>
  );
}
export default ImageHandler;

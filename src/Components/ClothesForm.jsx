import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ensure the modal root element is set
Modal.setAppElement('#root'); // Adjust according to your app's root element

const ClothesForm = ({ initialValues = {}, isOpen, onClose }) => {
  const [formValues, setFormValues] = useState({
    color: '',
    type_id: '',
    material_id: '',
    temperature_range_id: '',
    humidity_id: '',
    waterproof: false,
    prompt: '',
    image_base64: '',
    image_url: ''
  });
  const [types, setTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [temperatureRanges, setTemperatureRanges] = useState([]);
  const [humidityLevels, setHumidityLevels] = useState([]);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormValues(prevValues => ({
        ...prevValues,
        ...initialValues
      }));
    }
  }, [initialValues]);

  useEffect(() => {
    const fetchOptions = async (url, setter) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message, { position: 'bottom-center' });
      }
    };

    fetchOptions('http://localhost:3003/api/types', setTypes);
    fetchOptions('http://localhost:3003/api/materials', setMaterials);
    fetchOptions('http://localhost:3003/api/temperature-ranges', setTemperatureRanges);
    fetchOptions('http://localhost:3003/api/humidity-levels', setHumidityLevels);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('No token found. Please log in.', { position: 'bottom-center' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/api/clothes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.status === 403) {
        toast.error('Forbidden: Invalid token or access denied.', { position: 'bottom-center' });
        throw new Error('Forbidden: Invalid token or access denied.');
      }

      if (!response.ok) {
        throw new Error('Failed to create clothes');
      }

      const data = await response.json();
      toast.success('Clothes created successfully!', { position: 'bottom-center' });
      onClose(); // Close the modal on successful submission
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message, { position: 'bottom-center' });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Clothes</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Color</label>
            <input 
              type="text" 
              name="color" 
              value={formValues.color} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Type</label>
            <select 
              name="type_id" 
              value={formValues.type_id} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Material</label>
            <select 
              name="material_id" 
              value={formValues.material_id} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Material</option>
              {materials.map((material) => (
                <option key={material.material_id} value={material.material_id}>{material.material_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Temperature Range</label>
            <select 
              name="temperature_range_id" 
              value={formValues.temperature_range_id} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Temperature Range</option>
              {temperatureRanges.map((range) => (
                <option key={range.temperature_range_id} value={range.temperature_range_id}>
                  {range.temperature_range_name} ({range.min_temp}°C - {range.max_temp}°C)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Humidity</label>
            <select 
              name="humidity_id" 
              value={formValues.humidity_id} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Humidity</option>
              {humidityLevels.map((level) => (
                <option key={level.humidity_id} value={level.humidity_id}>
                  {level.humidity_name} ({level.min_humidity}% - {level.max_humidity}%)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Waterproof</label>
            <input 
              type="checkbox" 
              name="waterproof" 
              checked={formValues.waterproof} 
              onChange={handleChange} 
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Prompt</label>
            <input 
              type="text" 
              name="prompt" 
              value={formValues.prompt} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Image URL</label>
            <input 
              type="text" 
              name="image_url" 
              value={formValues.image_url} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Image Base64</label>
            <textarea 
              name="image_base64" 
              value={formValues.image_base64} 
              onChange={handleChange} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Close
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ClothesForm;

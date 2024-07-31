import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateClothes = ({ clothesId, isOpen, onClose }) => {
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
    const fetchClothesData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please log in.', { position: 'bottom-center' });
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/clothes/${clothesId}`, {
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
          throw new Error('Failed to fetch clothes data');
        }

        const data = await response.json();
        setFormValues(data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message, { position: 'bottom-center' });
      }
    };

    if (clothesId) {
      fetchClothesData();
    }
  }, [clothesId]);

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

    fetchOptions(`${BASE_URL}/api/types`, setTypes);
    fetchOptions(`${BASE_URL}/api/materials`, setMaterials);
    fetchOptions(`${BASE_URL}/api/temperature-ranges`, setTemperatureRanges);
    fetchOptions(`${BASE_URL}/api/humidity-levels`, setHumidityLevels);
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
      const response = await fetch(`${BASE_URL}/api/clothes/${clothesId}`, {
        method: 'PUT',
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
        throw new Error('Failed to update clothes');
      }

      const data = await response.json();
      toast.success('Clothes updated successfully!', { position: 'bottom-center' });
      onClose();
      window.location.reload();
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
          className="absolute top-4 right-4 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">Update Clothes</h2>
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
          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Update Clothes
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateClothes;

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClothesCard from './ClothesCard';
import GetWeather from './GetWeather';

const GenerateOutfit = (currentWeather) => {
  const [clothes, setClothes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState([]);
  const [error, setError] = useState('');
  const [selectedWeatherData, setSelectedWeatherData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchClothes = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No token found. Please log in.', { position: 'bottom-center' });
        setLoading(false);
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
          toast.error('Forbidden: Invalid token or access denied.', { position: 'bottom-center' });
          throw new Error('Forbidden: Invalid token or access denied.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch clothes');
        }

        const data = await response.json();
        setClothes(data);
        console.log('Fetched clothes:', data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message, { position: 'bottom-center' });
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No token found. Please log in.', { position: 'bottom-center' });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/locations`, {
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
          throw new Error('Failed to fetch locations');
        }

        const data = await response.json();
        setUser(data.user);
        setLocations(data.locations);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message, { position: 'bottom-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
    fetchClothes();
  }, []);

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    const selectedLocation = locations.find(location => location.location_id === parseInt(selectedId));
    setSelectedLocation(selectedLocation);
  };

  const handleOccasionChange = (e) => {
    const selectedOccasion = e.target.value;
    setSelectedOccasion(selectedOccasion);

    // Filter clothes based on the selected occasion
    const filteredOccasion = clothes.filter(item => item.prompt === selectedOccasion);

    // Check if weather data is available to further filter the clothes
    if (selectedWeatherData) {
      const climateFilter = (clothes, weather) => {
        const filtered = clothes.filter(item => {
          const tempMatch = item.min_temp <= weather.temperature && weather.temperature <= item.max_temp;
          const humidityMatch = item.min_humidity <= weather.humidity && weather.humidity <= item.max_humidity;
          const adjustedHumidityMatch = weather.humidity > item.max_humidity ? true : humidityMatch;
          return tempMatch && adjustedHumidityMatch;
        });
        return filtered;
      };

      const filteredClothes = climateFilter(filteredOccasion, selectedWeatherData[0]); // Access the first element of selectedWeatherData

      // Generate outfit with the filtered data
      const outfitArray = generateOutfit(filteredClothes);
      setOutfit(outfitArray);
    } else {
      // If no weather data, generate outfit with occasion filtered data only
      const outfitArray = generateOutfit(filteredOccasion);
      setOutfit(outfitArray);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateOutfit = (filteredClothes) => {
    const outfit = [];
    const addedTypes = new Set();

    // Shuffle the filtered clothes
    shuffleArray(filteredClothes);

    // Add clothes in head-to-toe order
    for (const item of filteredClothes) {
      if (!addedTypes.has(item.type_name)) {
        outfit.push(item.clothes_id);
        addedTypes.add(item.type_name);
      }
    }

    // Ensure IDs are in head-to-toe order (assuming the order is: T-shirt, Jacket, Sweater, Shorts, Pants, Tank-Top, Sandals, Sneakers, Boots, Heels, Suit, Button-Up Shirt)
    const typeOrder = ['T-shirt', 'Jacket', 'Sweater', 'Tank-Top', 'Shorts', 'Pants', 'Sandals', 'Sneakers', 'Boots', 'Heels',`Suit`,`Button-Up Shirt`];
    outfit.sort((a, b) => {
      const typeA = filteredClothes.find(item => item.clothes_id === a).type_name;
      const typeB = filteredClothes.find(item => item.clothes_id === b).type_name;
      return typeOrder.indexOf(typeA) - typeOrder.indexOf(typeB);
    });

    return outfit;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-purple-400 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full mb-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">My Locations</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="text-center">
            <select 
              onChange={handleLocationChange} 
              className="bg-white border border-gray-300 rounded px-4 py-2 mb-4 w-1/2 text-center"
            >
              <option value="">Select a Location</option>
              {locations.map((location) => (
                <option key={location.location_id} value={location.location_id}>
                  {location.name}
                </option>
              ))}
            </select>
            {selectedLocation && (
              <div>
                <h2 className="text-2xl font-bold">{selectedLocation.name}</h2>
                <GetWeather 
                  coordinates={{ lat: selectedLocation.x_coordinate, lng: selectedLocation.y_coordinate }}
                  selectedWeatherData={selectedWeatherData}
                  setSelectedWeatherData={setSelectedWeatherData}
                />
                {console.log(selectedWeatherData)}
              </div>
            )}
          </div>
        )}
      </div>
  
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">My Outfit</h1>
        <div className="text-center mb-4">
          <select 
            onChange={handleOccasionChange} 
            className="bg-white border border-gray-300 rounded px-4 py-2 w-1/2 text-center"
          >
            <option value="">Select Occasion</option>
            <option value="Casual">Casual</option>
            <option value="Work">Work</option>
            <option value="Business Casual">Business Casual</option>
          </select>
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center">{error}</p>
        ) : (
          <div className="outfit flex flex-col items-center">
            {clothes.filter(item => outfit.includes(item.clothes_id)).map((item) => (
              <ClothesCard key={item.clothes_id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );  
};

export default GenerateOutfit;

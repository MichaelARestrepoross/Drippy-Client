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
  const [selectedColor, setSelectedColor] = useState('');
  const [weatherToggle, setWeatherToggle] = useState(false)

  const colorMatches = {
    "Red": ["#FFFFFF", "#000000", "#F5F5DC", "#FFA500", "#A52A2A", "#800000", "#FF6347", "#FFD700", "#8B0000"],
    "Yellow": ["#000000", "#FFFFFF", "#808080", "#8B4513", "#FFD700", "#FFA500", "#FF4500", "#32CD32", "#BDB76B"],
    "Brown": ["#FFFFFF", "#000000", "#F5F5DC", "#FF4500", "#D2691E", "#8B4513", "#A52A2A", "#DEB887", "#CD853F"],
    "Orange": ["#000000", "#FFFFFF", "#FFD700", "#FF8C00", "#FF4500", "#D2691E", "#8B4513", "#32CD32", "#800000"],
    "Beige": ["#000000", "#FFFFFF", "#FF0000", "#D2691E", "#A52A2A", "#8B4513", "#CD853F", "#DEB887", "#FFD700"],
    "Gray": ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#8B0000", "#808080", "#A9A9A9", "#708090", "#2F4F4F"],
    "Lime": ["#000000", "#FFFFFF", "#FF0000", "#FFA500", "#FFFF00", "#32CD32", "#00FF00", "#8A2BE2", "#8B0000"],
    "Tan": ["#000000", "#FFFFFF", "#FF0000", "#D2691E", "#A52A2A", "#8B4513", "#CD853F", "#DEB887", "#FFD700"],
    "Lavender": ["#000000", "#FFFFFF", "#8A2BE2", "#9370DB", "#FF00FF", "#BA55D3", "#9932CC", "#4B0082", "#800080"],
    "Black": ["#FFFFFF", "#FF0000", "#FFFF00", "#FFA500", "#00FF00", "#0000FF", "#A52A2A", "#800080", "#00FFFF"],
    "White": ["#000000", "#FF0000", "#0000FF", "#8B4513", "#32CD32", "#FFD700", "#8A2BE2", "#FF4500", "#00FFFF"],
    "Violet": ["#FFFFFF", "#FFD700", "#32CD32", "#0000FF", "#4B0082", "#8A2BE2", "#DDA0DD", "#EE82EE", "#800080"],
    "Indigo": ["#FFFFFF", "#FFD700", "#32CD32", "#0000FF", "#4B0082", "#8A2BE2", "#DDA0DD", "#EE82EE", "#800080"],
    "Blue": ["#FFFFFF", "#FFD700", "#32CD32", "#0000FF", "#4B0082", "#8A2BE2", "#DDA0DD", "#EE82EE", "#800080"],
    "Green": ["#FFFFFF", "#FFD700", "#32CD32", "#0000FF", "#4B0082", "#8A2BE2", "#DDA0DD", "#EE82EE", "#800080"],
  };

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
        const response = await fetch('http://localhost:3003/api/locations', {
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
  }, [selectedLocation]);

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    const selectedLocation = locations.find(location => location.location_id === parseInt(selectedId));
    setSelectedLocation(selectedLocation);
    setWeatherToggle(!weatherToggle)
    setSelectedOccasion(''); // Reset occasion when location changes
    setSelectedColor(''); // Reset color when location changes
    setOutfit([]); // Clear outfit when location changes
    console.log(weatherToggle)
  };

  const handleOccasionChange = (e) => {
    const selectedOccasion = e.target.value;
    setSelectedOccasion(selectedOccasion);
    setSelectedColor(''); // Reset color when occasion changes
  };

  const handleColorChange = (e) => {
    const selectedColor = e.target.value;
    setSelectedColor(selectedColor);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const colorDistance = (color1, color2) => {
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  };

  const isColorMatch = (color1, color2, threshold = 50) => {
    return colorDistance(color1, color2) < threshold;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const generateOutfit = () => {
    if (!selectedLocation || !selectedOccasion) {
      toast.error('Please select a location and occasion.', { position: 'bottom-center' });
      return;
    }

    // Filter clothes based on the selected occasion
    const filteredOccasion = clothes.filter(item => item.prompt === selectedOccasion);

    // Filter based on weather data if available
    let filteredClothes = filteredOccasion;
    if (selectedWeatherData) {
      const climateFilter = (clothes, weather) => {
        return clothes.filter(item => {
          const tempMatch = item.min_temp <= weather.temperature && weather.temperature <= item.max_temp;
          const humidityMatch = item.min_humidity <= weather.humidity && weather.humidity <= item.max_humidity;
          const adjustedHumidityMatch = weather.humidity > item.max_humidity ? true : humidityMatch;
          return tempMatch && adjustedHumidityMatch;
        });
      };
      filteredClothes = climateFilter(filteredOccasion, selectedWeatherData[0]);
    }

    // Filter based on selected color if available
    if (selectedColor) {
      const colorMatch = colorMatches[selectedColor] || [];
      filteredClothes = filteredClothes.filter(item => colorMatch.some(matchColor => isColorMatch(item.color, matchColor)));
    }

    // Generate outfit with the filtered data
    const outfitArray = [];
    const addedTypes = new Set();
    shuffleArray(filteredClothes);

    for (const item of filteredClothes) {
      if (!addedTypes.has(item.type_name)) {
        outfitArray.push(item.clothes_id);
        addedTypes.add(item.type_name);
      }
    }

    // Ensure IDs are in head-to-toe order
    const typeOrder = ['T-shirt', 'Jacket', 'Sweater', 'Tank-Top', 'Shorts', 'Pants', 'Sandals', 'Sneakers', 'Boots', 'Heels'];
    outfitArray.sort((a, b) => {
      const typeA = filteredClothes.find(item => item.clothes_id === a).type_name;
      const typeB = filteredClothes.find(item => item.clothes_id === b).type_name;
      return typeOrder.indexOf(typeA) - typeOrder.indexOf(typeB);
    });

    setOutfit(outfitArray);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-purple-300 min-h-screen flex flex-col items-center justify-center">
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
                  weatherToggle={weatherToggle}
                  setWeatherToggle={setWeatherToggle}
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
            value={selectedOccasion}
            disabled={!selectedLocation}
            className="bg-white border border-gray-300 rounded px-4 py-2 w-1/2 text-center mb-4"
          >
            <option value="">Select Occasion</option>
            <option value="Casual">Casual</option>
            <option value="Work">Work</option>
            <option value="Business Casual">Business Casual</option>
          </select>
          <select 
            onChange={handleColorChange} 
            value={selectedColor}
            disabled={!selectedLocation || !selectedOccasion}
            className="bg-white border border-gray-300 rounded px-4 py-2 w-1/2 text-center mb-4"
          >
            <option value="">Select Color</option>
            <option value="Red">Red</option>
            <option value="Yellow">Yellow</option>
            <option value="Brown">Brown</option>
            <option value="Orange">Orange</option>
            <option value="Beige">Beige</option>
            <option value="Gray">Gray</option>
            <option value="Lime">Lime</option>
            <option value="Tan">Tan</option>
            <option value="Lavender">Lavender</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Violet">Violet</option>
            <option value="Indigo">Indigo</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
          </select>
        </div>
        <button 
          onClick={generateOutfit}
          disabled={!selectedLocation || !selectedOccasion}
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Generate Outfit
        </button>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center">{error}</p>
        ) : (
          <div className="outfit flex flex-col items-center mt-4">
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

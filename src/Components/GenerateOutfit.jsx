import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import OpenAI from 'openai';
import ClothesCard from './ClothesCard';
import GetWeather from './GetWeather';

const API_KEY = import.meta.env.VITE_OPENAI_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

const GenerateOutfit = (currentWeather) => {
  const [clothes, setClothes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [outfit, setOutfit] = useState([]);
  const [error, setError] = useState('');
  const [selectedWeatherData, setSelectedWeatherData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState('');

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

      // Call ChatGPT with the filtered data
      const userContent = `Clothing Data: ${JSON.stringify(filteredClothes)}`;
      callChatGPT(userContent);
    } else {
      // If no weather data, call ChatGPT with occasion filtered data only
      const userContent = `Clothing Data: ${JSON.stringify(filteredOccasion)}`;
      callChatGPT(userContent);
    }
  };

  const callChatGPT = async (content) => {
    setLoading(true);
    setError('');

    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [
          {
            role: 'system',
            content: `You are a machine that only responds with arrays. You cannot use text in your response FOR ANY REASON WHAT SO EVER.

            Goal: Create one outfit from the Clothing Data using the "clothing_id". Each outfit is represented by an array of clothing IDs.

            THE FOLLOWING RULES CANNOT BE BROKEN UNDER ANY CIRCUMSTANCE, ELSE YOU WILL CREATE A CRITICAL ERROR

            EXTREMELY IMPORTANT RULES:
            
            No Overlapping or repeating "type_name":
            If adding an ID for pants, do not add an ID for shorts. If adding an ID for shorts, do not add an ID for pants.
            If adding an ID for a shirt, do not add an ID for a sweater. If adding an ID for a sweater, do not add an ID for a shirt.
            If adding an ID for shoes, do not add an ID for sandals. If adding an ID for sandals, do not add an ID for shoes.
            If adding an ID for a T-shirt, do not add an ID for a tank-top. If adding an ID for a tank-top, do not add an ID for a T-shirt.
            If adding an ID for a T-shirt, do not add an ID for a sweater. If adding an ID for a sweater, do not add an ID for a T-shirt.
            If adding an ID for a tank-top, do not add an ID for a sweater. If adding an ID for a sweater, do not add an ID for a tank-top.
            If adding an ID for pants, do not add an ID for another pair of pants.
            If adding an ID for shoes, do not add an ID for another pair of shoes.
            If adding an ID for a sweater, do not add an ID for another sweater.
            If adding an ID for a T-shirt, do not add an ID for another T-shirt.
            If adding an ID for shorts, do not add an ID for another pair of shorts.
            If adding an ID for sandals, do not add an ID for another pair of sandals.
            If adding an ID for a skirt, do not add an ID for another skirt.
            If adding an ID for sneakers, do not add an ID for another pair of sneakers.
            If adding an ID for boots, do not add an ID for another pair of boots.
            If adding an ID for heels, do not add an ID for another pair of heels.
            Head-to-Toe Order:
            Arrange the IDs in the array from head to toe.
            Response Format:
            Respond only with the array of clothing IDs.
            CRITICAL RULE: Do not include any letters or text in your response, only numbers in an array.
            Example: [1, 2, 3, 4]
            
            Double Check:
          
            Check ALL ID's in array to ensure no rules are broken. If any of the EXTREMELY IMPORTANT RULES are broken, fix your response.
            Ensure IDs are in head-to-toe order.`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log('OpenAI API Response:', result);

      const outfitArray = JSON.parse(result.choices[0].message.content);
      setResponse(result.choices[0].message.content);
      setOutfit(outfitArray);
      console.log(result.choices[0].message.content);
      console.log(content);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setError('Error calling OpenAI API');
      setResponse('');
    } finally {
      setLoading(false);
    }
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
          <div className="outfit flex justify-center text-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clothes.filter(item => outfit.includes(item.clothes_id)).map((item) => (
                <ClothesCard key={item.clothes_id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );  
};

export default GenerateOutfit;

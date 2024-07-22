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
  const [extractedClothesData, setExtractedClothesData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [outfit, setOutfit] = useState([]);
  const [error, setError] = useState('');
  const [selectedWeatherData, setSelectedWeatherData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
        setExtractedClothesData(extractFields(data));
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message, { position: 'bottom-center' });
      } finally {
        setLoading(false);
      }
    };

    const extractFields = (data) => {
      return data.map(item => ({
        clothes_id: item.clothes_id,
        user_id: item.user_id,
        color: item.color,
        type_id: item.type_id,
        material_id: item.material_id,
        temperature_range_id: item.temperature_range_id,
        humidity_id: item.humidity_id,
        waterproof: item.waterproof
      }));
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

  const userContent = `Weather Data: ${JSON.stringify(selectedWeatherData)}\nClothing Data: ${JSON.stringify(extractedClothesData)}`;

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    const selectedLocation = locations.find(location => location.location_id === parseInt(selectedId));
    setSelectedLocation(selectedLocation);
    callChatGPT(userContent);
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
            content: `Each article of clothing is its own object, represented by "clothing_id". Create an array of IDs for the articles of clothing in the Clothing Data best suited to create ONE outfit based on the temperature and humidity in the provided Weather Data. Make sure the clothing selected falls within the range of the minimum and maximum humidity and temperature values. After analyzing the clothing data and taking the weather data into account, appropriately make one outfit using the IDs. One shirt/sweater, one pair of pants/shorts, one pair of shoes. Ensure the following rule is not broken under any circumstance: DO NOT ADD TWO TYPES OF EACH CLOTHING. For example, don't add a pair of shorts and pants, two pairs of shoes, a shirt and a sweater, etc. The array should have the clothing IDs in order from head to toe. I cannot stress this enough, DO NOT RESPOND WITH ANYTHING OTHER THAN THE CREATED ARRAY IN HEAD-TO-TOE ORDER. YOUR RESPONSE SHOULD HAVE NO LETTERS, ONLY NUMBERS AND CHARACTERS. Use the table below to know what the values in each element of the array mean:
            
            VALUES FOR SPECIFIC PROPERTIES BELOW:

            -START OF TABLE-
            "type_id" values:
            1: T-shirt
            2: Jacket
            3: Sweater
            4: Shorts
            5: Pants
            6: Tank-Top
            7: Sandals
            8: Sneakers
            9: Boots
            10: Heels

            "material_id" values:
            1: Cotton
            2: Polyester
            3: Wool
            4: Silk
            5: Denim
            6: Leather
            7: Latex
            8: Rubber
            9: Canvas

            "temperature_range_id" values:
            1: Very Cold (-50 to 0)
            2: Cold (1 to 50)
            3: Mild (51 to 70)
            4: Warm (71 to 140)

            "humidity_id" values:
            1: Very Low (0 to 20)
            2: Low (21 to 40)
            3: Medium (41 to 60)
            4: High (61 to 80)
            5: Very High (81 to 100)
            -END OF TABLE-`
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">Your Locations</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="text-center">
          <select 
            onChange={handleLocationChange} 
            className="bg-white border border-gray-300 rounded px-4 py-2 mb-4"
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
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">Your Clothes</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center">{error}</p>
      ) : (
        <div className="outfit text-center">
          <p>Outfit Created:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clothes.filter(item => outfit.includes(item.clothes_id)).map((item) => (
              <ClothesCard key={item.clothes_id} {...item} />
            ))}
          </div>
        </div>
      )}
      {user && (
        <div className="user-info text-center my-4">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p>{user.email}</p>
          <img src={user.photo} alt="User Photo" className="mx-auto rounded-full h-24 w-24" />
        </div>
      )}
    </div>
  );
};

export default GenerateOutfit;

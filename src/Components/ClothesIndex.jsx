import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClothesCard from './ClothesCard';

const ClothesIndex = () => {
  const [clothes, setClothes] = useState([]);
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

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

    fetchClothes();
    fetchLocations();
  }, []);

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    const selectedLocation = locations.find(location => location.location_id === parseInt(selectedId));
    setSelectedLocation(selectedLocation);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-purple-700">Your Clothes</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-4">
          {clothes.map((item) => (
            <ClothesCard key={item.clothes_id} {...item} />
          ))}
        </div>
      )}
      {user && (
        <div className="user-info text-center my-4">
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p>{user.email}</p>
          <img src={user.photo} alt="User Photo" className="mx-auto rounded-full h-24 w-24" />
        </div>
      )}
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
              <p>Coordinates: ({selectedLocation.x_coordinate}, {selectedLocation.y_coordinate})</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClothesIndex;

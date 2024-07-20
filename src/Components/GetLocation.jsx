import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Ensure toast is imported if not already
import GetWeather from './GetWeather';

const GetLocation = () => {
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [label, setLabel] = useState('');  // This will be used as 'name' in the table
  const [locations, setLocations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('No token found. Please log in.', { position: 'bottom-center' });
      return;
    }

    const location = `${city}, ${stateName}`;
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: location }, async (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const newLocation = {
          name: label,
          x_coordinate: location.lat(),
          y_coordinate: location.lng()
        };

        try {
          const response = await fetch('http://localhost:3003/api/locations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLocation),
          });

          if (response.status === 403) {
            toast.error('Forbidden: Invalid token or access denied.', { position: 'bottom-center' });
            return;
          }

          if (!response.ok) {
            throw new Error('Failed to add location');
          }

          const data = await response.json();
          toast.success('Location added successfully!', { position: 'bottom-center' });
          setLocations([...locations, newLocation]);
          setCity('');
          setStateName('');
          setLabel('');
        } catch (error) {
          console.error('Submit error:', error);
          toast.error(error.message, { position: 'bottom-center' });
        }
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
        toast.error(`Geocode failure: ${status}`, { position: 'bottom-center' });
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="State"
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location Name"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Location</button>
      {locations.length > 0 && (
        <div>
          {locations.map((location, index) => (
            <div key={index}>
              <p>{location.name} ({location.city}, {location.stateName})</p>
              <p>Latitude: {location.x_coordinate.toFixed(6)}</p>
              <p>Longitude: {location.y_coordinate.toFixed(6)}</p>
              {/* <GetWeather coordinates={{ lat: location.x_coordinate, lng: location.y_coordinate }} /> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetLocation;

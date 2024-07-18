import React, { useState, useEffect } from 'react';

const GetLocation = () => {
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [formattedCoordinates, setFormattedCoordinates] = useState(null);

  const handleSearch = () => {
    const location = `${city}, ${stateName}`;
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const formattedLat = formatCoordinate(location.lat(), 'lat');
        const formattedLng = formatCoordinate(location.lng(), 'lng');
        setFormattedCoordinates({
          lat: formattedLat,
          lng: formattedLng
        });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  // useEffect(() => {
  //   if (!window.google) {
  //     console.error('Google Maps JavaScript API library must be loaded.');
  //   }
  // }, []);

  const formatCoordinate = (coordinate, type) => {
    const direction = type === 'lat' 
      ? coordinate >= 0 ? 'N' : 'S'
      : coordinate >= 0 ? 'E' : 'W';
    return `${Math.abs(coordinate).toFixed(6)}° ${direction}`;
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
      <button onClick={handleSearch}>Search</button>
      {formattedCoordinates && (
        <div>
          <p>Latitude: {formattedCoordinates.lat}</p>
          <p>Longitude: {formattedCoordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default GetLocation;

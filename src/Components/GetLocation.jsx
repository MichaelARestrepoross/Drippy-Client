import React, { useState, useEffect } from 'react';
import GetWeather from './GetWeather';

const GetLocation = () => {
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [label, setLabel] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [locations, setLocations] = useState([]);

  const handleSearch = () => {
    const location = `${city}, ${stateName}`;
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const formattedLat = formatCoordinate(location.lat(), 'lat');
        const formattedLng = formatCoordinate(location.lng(), 'lng');
        const newCoordinates = {
          lat: location.lat(),
          lng: location.lng(),
          formattedLat,
          formattedLng,
          label,
          city,
          stateName
        };
        setCoordinates(newCoordinates);
        setLocations([...locations, newCoordinates]);
        setCity('');
        setStateName('');
        setLabel('');
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const formatCoordinate = (coordinate, type) => {
    const direction = type === 'lat'
      ? coordinate >= 0 ? 'N' : 'S'
      : coordinate >= 0 ? 'E' : 'W';
    return `${Math.abs(coordinate).toFixed(6)}° ${direction}`;
  };

  const handleLocationChange = (event) => {
    const selectedLocation = locations.find(location => location.label === event.target.value);
    setCoordinates(selectedLocation);
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
        placeholder="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {locations.length > 0 && (
        <div>
          <label htmlFor="locationSelect">My Locations: </label>
          <select id="locationSelect" onChange={handleLocationChange}>
            <option value="">Select a location</option>
            {locations.map((location, index) => (
              <option key={index} value={location.label}>
                {location.label} ({location.city}, {location.stateName})
              </option>
            ))}
          </select>
        </div>
      )}
      {coordinates && (
        <div>
          <p>Latitude: {coordinates.formattedLat}</p>
          <p>Longitude: {coordinates.formattedLng}</p>
          <GetWeather coordinates={coordinates} />
        </div>
      )}
    </div>
  );
};

export default GetLocation;

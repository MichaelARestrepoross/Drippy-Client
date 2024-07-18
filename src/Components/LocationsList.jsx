import React from 'react';

const LocationsList = ({ locations }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {locations.length === 0 ? (
        <p className="text-center">No locations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div key={location.location_id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-2">{location.name}</h2>
              <p className="text-gray-700">Coordinates: {location.x_coordinate}, {location.y_coordinate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsList;

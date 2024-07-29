import React from 'react';

const FilterBox = ({ type, onClick }) => {
  const handleClick = () => {
    onClick(type);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-24 h-16 m-2 flex items-center justify-center rounded-md border shadow-dark-lg hover:bg-white hover:text-purple-700 ${
        type ? 'bg-purple-700 text-white' : 'bg-gray-500 text-white'
      }`}
    >
      {type}
    </button>
  );
};

export default FilterBox;

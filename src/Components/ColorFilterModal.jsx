import React from 'react';

const ColorFilterModal = ({ isOpen, onRequestClose, colors, onColorSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/30 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
        <h2 className="text-xl font-bold mb-4">Select a Color</h2>
        <div className="max-h-96 overflow-y-auto mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onColorSelect(null)}
              className="w-24 h-12 flex items-center justify-center border rounded-lg bg-gray-200 text-gray-700 text-base transition-shadow hover:shadow-lg hover:shadow-gray-400"
            >
              None
            </button>
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                style={{ backgroundColor: color }}
                className="w-24 h-12 flex items-center justify-center rounded-lg text-base font-medium text-white transition-shadow hover:shadow-lg"
              >
                <span className="text-sm">{color}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onRequestClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorFilterModal;

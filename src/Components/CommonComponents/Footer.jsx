import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-400 text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="#" className="text-white-400 hover:text-gray">Contact Us</a>
          <div className="text-">
            <p className="text-sm">&copy; 2024 Drippy. All rights reserved.</p>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

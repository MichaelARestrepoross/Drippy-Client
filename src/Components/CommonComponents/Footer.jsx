import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-purple-600 py-6">
      <div className="container mx-auto px-6">
        <div className="flex justify-center items-center">
          <div>
            <a 
              href={`https://www.amazon.com/pants/s?k=Clothes`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Need more clothes? Check out Amazon for more options
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/homepage');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Drippy</h1>
          <p className="text-gray-600 mt-4"></p>
          <div className="mt-6">
            <button
              onClick={handleGetStarted}
              className="w-48 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Get Started
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={handleGoHome}
              className="w-48 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Sign Up/In
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-200 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Features</h2>
          <div className="flex flex-wrap justify-center mt-10">
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white shadow rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800">Easy Wardrobe Editing</h3>
                <p className="text-gray-600 mt-2">Add clothes to your wardrobe with the click of a button</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white shadow rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800">Real Time Weather Info</h3>
                <p className="text-gray-600 mt-2">Get updated outfits based on the current weather of your desired location</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white shadow rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800">Instant Outfit Generation</h3>
                <p className="text-gray-600 mt-2">Spend less time worrying about your outfits and focus on what really matters to you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">About Us</h2>
          <p className="text-gray-600 mt-4">Information about your company or service.</p>
        </div>
      </section>

      <section id="contact" className="bg-gray-200 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-4"></p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

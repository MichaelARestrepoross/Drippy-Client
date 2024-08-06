import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";
import "./Header.css"

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.top-background').classList.add('bounce');
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/homepage');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-500">
      <section className="top-background mb-10">
      </section>
      <div className="button-container">
        <button
          onClick={handleGetStarted}
          className="w-48 px-4 py-2 bg-white text-purple-500 rounded hover:bg-purple-500 hover:text-white shadow-dark-lg"
        >
          Get Started
        </button>
        <button
          onClick={handleGoHome}
          className="w-48 px-4 py-2 bg-gray-400 text-purple-600 rounded hover:bg-gray-500 hover:text-purple-300 shadow-dark-lg"
        >
          Sign Up/In
        </button>
      </div>

      <section id="features" className="py-20">
        <div className="container mx-auto px-6 text-center bg-transparent">
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

      <section id="about" className="py-20">
        <div className="container mx-auto px-6 text-center bg-transparent">
          <h2 className="text-3xl font-bold text-gray-800">About Us</h2>
          <p className="text-gray-600 mt-4">Information about your company or service.</p>
        </div>
      </section>

      {/* <section id="contact" className="py-20">
        <div className="container mx-auto px-6 text-center bg-transparent">
          <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-4"></p>
        </div>
      </section> */}
    </div>
  );
};

export default LandingPage;

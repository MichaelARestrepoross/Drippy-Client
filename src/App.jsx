import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { auth } from './helpers/firebase';

// Import Common Components
import Footer from './Components/CommonComponents/Footer';
import Header from './Components/CommonComponents/Header';
import HomePage from './Components/CommonComponents/HomePage';
import LandingPage from './Components/CommonComponents/LandingPage';
import Login from './Components/CommonComponents/Login';
import Profile from './Components/CommonComponents/Profile';
import Register from './Components/CommonComponents/Register';
import SignInWithGoogle from './Components/CommonComponents/SignInWithGoogle';
import Test from './Components/CommonComponents/Test';
import AboutUs from './Components/CommonComponents/AboutUs';

// Import Other Components
import ClothesCard from './Components/ClothesCard';
import ClothesForm from './Components/ClothesForm';
import ClothesIndex from './Components/ClothesIndex';
import Gemini from './Components/Gemini';
import GenerateOutfit from './Components/GenerateOutfit';
import GptGenerator from './Components/GptGenerator';
import OpenCamera from './Components/OpenCamera';
import UploadImage from './Components/UploadImage';
import Wardrobe from './Components/Wardrobe';
import ImageHandler from './Components/ImageHandler';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './Components/CommonComponents/Header.css'

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const loadScript = (url) => {
      if (!document.querySelector(`script[src="${url}"]`)) {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      }
    };

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`);
  }, []);

  return (
    <div>
      <Header/>
      <Routes>
        {/* <Route path="/" element={user ? <Navigate to="/profile" /> : <Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/test" element={user ? <Test /> : <Login />} />

        {/* Common Components */}
        <Route path="/footer" element={<Footer />} />
        <Route path="/header" element={<Header />} />
        <Route path="/homepage" element={user ?<HomePage />:<Login /> } />
        <Route path="/" element={<LandingPage />} />
        <Route path="/signinwithgoogle" element={<SignInWithGoogle />} />
        <Route path="/about" element={<AboutUs />} />
        

        {/* Other Components */}
        <Route path="/clothesform" element={<ClothesForm />} />
        <Route path="/gemini" element={<Gemini />} />
        <Route path="/generateoutfit" element={ user ? <GenerateOutfit />:<Login />} />
        <Route path="/gptgenerator" element={<GptGenerator />} />
        <Route path="/opencamera" element={<OpenCamera />} />
        <Route path="/uploadimage" element={<UploadImage />} />
        <Route path="/wardrobe" element={user ? <Wardrobe />: <Login />} />
        <Route path="/addclothing" element={user ? <ImageHandler />: <Login />} />
      </Routes>
      {/* <Footer/> */}
      <ToastContainer />
    </div>
  );
}

export default App;

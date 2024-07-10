import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { auth } from './helpers/firebase'

// Import Common Components
import Footer from './Components/CommonComponents/Footer'
import Header from './Components/CommonComponents/Header'
import HomePage from './Components/CommonComponents/HomePage'
import LandingPage from './Components/CommonComponents/LandingPage'
import Login from './Components/CommonComponents/Login'
import Profile from './Components/CommonComponents/Profile'
import Register from './Components/CommonComponents/Register'
import SignInWithGoogle from './Components/CommonComponents/SignInWithGoogle'
import Test from './Components/CommonComponents/Test'

// Import Other Components
import ClothesCard from './Components/ClothesCard'
import ClothesForm from './Components/ClothesForm'
import ClothesIndex from './Components/ClothesIndex'
import Gemini from './Components/Gemini'
import GenerateOutfit from './Components/GenerateOutfit'
import GptGenerator from './Components/GptGenerator'
import OpenCamera from './Components/OpenCamera'
import UploadImage from './Components/UploadImage'
import Wardrobe from './Components/Wardrobe'

import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
  const [user, setUser] = useState()
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user)
    })
  }, [])
  return (
    <div>
      <Routes
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 100,
        }}
      >
        <Route path="/" element={user ? <Navigate to="/profile" /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/test" element={user ? <Test /> : <Login />} />

        {/* Common Components */}
        <Route path="/footer" element={<Footer />} />
        <Route path="/header" element={<Header />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/signinwithgoogle" element={<SignInWithGoogle />} />

        {/* Other Components */}
        <Route path="/clothescard" element={<ClothesCard />} />
        <Route path="/clothesform" element={<ClothesForm />} />
        <Route path="/clothesindex" element={<ClothesIndex />} />
        <Route path="/gemini" element={<Gemini />} />
        <Route path="/generateoutfit" element={<GenerateOutfit />} />
        <Route path="/gptgenerator" element={<GptGenerator />} />
        <Route path="/opencamera" element={<OpenCamera />} />
        <Route path="/uploadimage" element={<UploadImage />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
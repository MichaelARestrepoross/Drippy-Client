import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/drippylogo.png';
import "./Header.css"

const Header = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/homepage');
  };

  const handleNavigateWardrobe = () => {
    navigate('/wardrobe');
  };

  const handleNavigateLanding = () => {
    navigate('/landingpage');
  };
  const handleNavigateProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" onClick={handleNavigateLanding}/>
        </div>
        <div className="nav-buttons">
          <button onClick={handleNavigateHome} className="nav-button home-nav">
            <span className="icon-placeholder-home">Home</span>
          </button>
          <button onClick={handleNavigateProfile} className="nav-button profile-nav">
            <span className="icon-placeholder-clothing">Profile</span>
          </button>
          <button onClick={handleNavigateProfile} className="nav-button profile-nav">
            <span className="icon-placeholder-clothing">About Us</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

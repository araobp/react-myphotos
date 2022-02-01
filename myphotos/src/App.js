import React, { useState, useEffect } from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { Upload } from './components-upload/Upload';

function Home() {

  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  let watchId = null;

  const startWatchingLocation = () => {
    watchId = navigator.geolocation.watchPosition(position => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    });
  };

  const stopWatchingLocation = () => {
    watchId && navigator.geolocation.clearWatch(watchId);
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      startWatchingLocation();
    }
    return () => { stopWatchingLocation() };
  }, []);

  return (
    <div>
      {location &&
        <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>
        || <p>Positioning...</p>
      }
      <Upload location={location} />
      <button className="button" onClick={() => navigate('/album')}>Album</button>
    </div>
  );
}

function App() {

  const [showMenu, setShowMenu] = useState(false);

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <div className="App">
      <div id="navi">
        <div className="navi-menu" onClick={() => toggleShowMenu()}>Menu</div>
        <div>Photos</div>
        <div className="navi-menu"></div>
      </div>
      {showMenu &&
        <div id="menu">
          <div className="navi-menu-text">Album</div>
          <div className="navi-menu-text">About</div>
        </div>
      }
      <div className="default" onClick={() => setShowMenu(false)}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/album' element={<AlbumPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { Upload } from './components-upload/Upload';

function Home() {

  const [location, setLocation] = useState(null);
  // const navigate = useNavigate();

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
        <div className="position-left" onClick={() => toggleShowMenu()}>Menu</div>
        <div>Photos</div>
      </div>
      {showMenu &&
        <div id="menu">
          <a href="/" className="navi-menu-text">Home</a>
          <a href="/album" className="navi-menu-text">Album</a>
          <a className="navi-menu-text">About</a>
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

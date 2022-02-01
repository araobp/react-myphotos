import React, { useState, useEffect } from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { Upload } from './components-upload/Upload';

function Home() {

  const [location, setLocation] = useState({});
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
      }
      <Upload location={location} />
      <button className="button" onClick={() => navigate('/album')}>Album</button>
    </div>
  );
}

function App() {
  return (
    <div className="default">
      <div id="navi">
        <div className="navi-icon">Menu</div>
        <div>Photos</div>
        <div className="navi-icon"></div>
      </div>
      <div>
        <div id="menu"></div>
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

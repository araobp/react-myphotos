import React, { useState, useEffect } from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { Upload } from './components-upload/Upload';

function Home() {

  const [isLocationSupported, setIsLocationSupported] = useState(false);
  const [location, setLocation] = useState();

  const navigate = useNavigate();

  console.log(`Location: ${isLocationSupported}`);

  let watchId = null;

  const startWatchingLocation = () => {
    watchId = navigator.geolocation.watchPosition(position => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    });
  };

  const stopWatchingLocation = () => {
    navigator.geolocation.clearWatch(watchId);
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLocationSupported(true);
      startWatchingLocation();
    }
    return () => {stopWatchingLocation()};
  }, []);
 
  return (
    <div className="default">
      <h1 id="title">Photos</h1>
      {location &&
        <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>
      }
      <Upload location={location}/>
      <button className="button" onClick={() => navigate('/album')}>Album</button>
    </div>
  );
}

function App() {
  return (
    <div className="default">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/album' element={<AlbumPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

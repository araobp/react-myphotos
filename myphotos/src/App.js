import React from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import AlbumPage from './page-album/Album';
import CameraPage from './page-camera/CameraPage';

const BASE_URL = "https://myphotos1088001.herokuapp.com";

function App() {

  const Home = () => {
    const navigate = useNavigate();
    return (
      <div className="default">
        <h1 id="title">Photos</h1>
        <button className="button" onClick={() => navigate('/camera')}>Camera</button>
        <button className="button" onClick={() => navigate('/album')}>Album</button>
      </div>
    );
  }

  return (
    <div className="default">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/album' element={<AlbumPage BASE_URL={BASE_URL} />} />
          <Route path='/camera' element={<CameraPage BASE_URL={BASE_URL} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

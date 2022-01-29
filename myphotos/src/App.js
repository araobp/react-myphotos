import React, {useState} from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { CameraPage } from './page-camera/CameraPage';
import { Upload } from './components/Upload'

const BASE_URL = "https://myphotos1088001.herokuapp.com";

function App() {

  const [imageFile, setImageFile] = useState();

  const Home = () => {
    const navigate = useNavigate();
    return (
      <div className="default">
        <h1 id="title">Photos</h1>
        <Upload BASE_URL={BASE_URL} imageFile={imageFile} setImageFile={setImageFile} />

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

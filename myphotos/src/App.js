import React, {useState, useMemo} from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { CameraPage } from './page-camera/CameraPage';
import { Upload } from './components/Upload'

function App() {

  const [imageDataURL, setImageDataURL] = useState();

  const uploadMemo = useMemo(() => <Upload setImageDataURL={setImageDataURL} />, [])

  const Home = () => {
    const navigate = useNavigate();
    return (
      <div className="default">
        <h1 id="title">Photos</h1>
        <img src={imageDataURL} width="30%"/>
        {uploadMemo}

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
          <Route path='/album' element={<AlbumPage />} />
          <Route path='/camera' element={<CameraPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

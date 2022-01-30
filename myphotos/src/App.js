import React from "react";  // named export
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { Upload } from './components/Upload'

function Home() {
  const navigate = useNavigate();
  return (
    <div className="default">
      <h1 id="title">Photos</h1>
      <Upload />
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

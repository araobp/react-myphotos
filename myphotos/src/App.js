import React, { useState } from "react";  // named export
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import { HomePage } from './page-home/HomePage';
import { AlbumPage } from './page-album/AlbumPage';
import { AboutPage } from './page-about/AboutPage';

function App() {

  const [showMenu, setShowMenu] = useState(false);

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <div className="App">
      <div id="navi">
        <div id="left" onClick={() => toggleShowMenu()}>Menu</div>
        <div id="center">Photos</div>
        <div id="right">login</div>
      </div>
      {showMenu &&
        <div id="menu">
          <a href="/" className="navi-menu-text">Home</a>
          <a href="/album" className="navi-menu-text">Album</a>
          <a href="/about" className="navi-menu-text">About</a>
        </div>
      }
      <div onClick={() => setShowMenu(false)}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/album' element={<AlbumPage />} />
            <Route path='/about' element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

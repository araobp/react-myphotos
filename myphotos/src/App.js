import React, { useState } from "react";  // named export
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import { AlbumPage } from './page-album/AlbumPage';
import { HomePage } from './page-home/HomePage';

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
          <a className="navi-menu-text">About</a>
        </div>
      }
      <div onClick={() => setShowMenu(false)}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/album' element={<AlbumPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

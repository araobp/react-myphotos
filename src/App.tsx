import { useState } from "react";
import Modal from "react-modal";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BiMenu } from "react-icons/bi";

import './App.css';
import { HomePage } from './page-home/HomePage';
import { AlbumPage } from './page-album/AlbumPage';
import { SettingsPage as SettingsPage } from './page-settings/SettingsPage';
import { AboutPage } from './page-about/AboutPage';

function App() {

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleShowMenu = () => setShowMenu(!showMenu);

  Modal.setAppElement("#root");

  return (
    <div className="App">
      <div id="navi">Photos</div>
      <div id="navi-left" onClick={e => toggleShowMenu()}><BiMenu /></div>    
      {showMenu &&
        <div id="menu">
          <a href="/" className="menu-text">Home</a>
          <a href="/album" className="menu-text">Album</a>
          <a href="/settings" className="menu-text">Settings</a>
          <a href="/about" className="menu-text">About</a>
        </div>
      }
      <div onClick={() => setShowMenu(false)} >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/album' element={<AlbumPage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='/about' element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

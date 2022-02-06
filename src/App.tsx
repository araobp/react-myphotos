import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import { HomePage } from './page-home/HomePage';
import { AlbumPage } from './page-album/AlbumPage';
import { CardPage } from "./page-album/CardPage";
import { AboutPage } from './page-about/AboutPage';
import { LoginPage } from './page-login/LoginPage';

function App() {

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [loginName, setLoginName] = useState<string>(localStorage.getItem("login") || "<Unknown>");

  const toggleShowMenu = () => setShowMenu(!showMenu);

  return (
    <div className="App">
      <div id="navi">
        <div id="left" onClick={e => toggleShowMenu()}>Menu</div>
        <div id="center">Photos</div>
        <div id="right">{loginName}</div>
      </div>
      {showMenu &&
        <div id="menu">
          <a href="/" className="menu-text">Home</a>
          <a href="/album" className="menu-text">Album</a>
          <a href="/card" className="menu-text">Card</a>
          <a href="/login" className="menu-text">Login</a>
          <a href="/about" className="menu-text">About</a>
        </div>
      }
      <div onClick={() => setShowMenu(false)}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/album' element={<AlbumPage />} />
            <Route path='/card' element={<CardPage />} />
            <Route path='/login' element={<LoginPage setLoginName={setLoginName}/>} />
            <Route path='/about' element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;

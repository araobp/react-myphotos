import './App.css';
import Page1 from './pages/page1'
import Page2 from './pages/page2'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div id="home">
      <h1>Home page</h1>
      <button className="button" onClick={() => navigate('/page1')}>Page1</button>
      <button className="button" onClick={() => navigate('/page2')}>Page2</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/page1' element={<Page1 />} />
          <Route path='/page2' element={<Page2 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

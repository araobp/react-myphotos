import React, { useState } from "react";  // named export
import Title from './components/Title';
import Form from './components/Form';
import Results from './components/Results';
import './App.css';


function App() {
  const [city, setCity] = useState("");  // array distruction
  const [results, setResults] = useState({
    country: "",
    cityName: "",
    temperature: "",
    conditionText: "",
    icon: ""
  });

  const getWeather = e => {
    e.preventDefault();
    fetch(`https://api.weatherapi.com/v1/current.json?key=97dd9644f14c4794aed13740221801&q=${city}&aqi=no`)
      .then(res => res.json())
      .then(data => {
        setResults({
          country: data.location.country,
          cityName: data.location.name,
          temperature: data.current.temp_c,
          conditionText: data.current.condition.text,
          icon: data.current.condition.icon
        })
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <Title />
        <Form setCity={setCity} getWeather={getWeather} />
        <Results results={results} />
      </header>
    </div>
  );
}

export default App;

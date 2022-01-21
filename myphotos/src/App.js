import React, { useState } from "react";  // named export
import Title from './components/Title';
import Form from './components/Form';
import Results from './components/Results';
import './App.css';

const BASE_URL = "https://myphotos1088001.herokuapp.com";

function App() {
  const [datetime, setDateTime] = useState("");
  const [record, setRecord] = useState({
    datetime: "",
    place: "",
    memo: "",
    format: "",
    image: null
  });  // array distruction

  const [results, setResults] = useState({
    country: "",
    cityName: "",
    temperature: "",
    conditionText: "",
    icon: ""
  });
  const [records, setRecords] = useState([])

  const getRecord = e => {
    e.preventDefault();
    fetch(`${BASE_URL}/records/${record}`)
      .then(res => res.json())
      .then(data => setRecord(data));
  }

  const getRecords = e => {
    e.preventDefault();
    fetch(`${BASE_URL}/records`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }

  return (
    <div className="App">
      <header className="App-header">
        <Title />
        <Form setDateTime={setDateTime} getRecord={getRecord} getRecords={getRecords}/>
        <Results results={results} />
      </header>
    </div>
  );
}

export default App;

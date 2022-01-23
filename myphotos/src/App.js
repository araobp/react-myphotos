import React, { useState } from "react";  // named export
import Title from './components/Title';
import Form from './components/Form';
import Results from './components/Results';
import './App.css';

const BASE_URL = "https://myphotos1088001.herokuapp.com";

function App() {
  
  const [id, setId] = useState({
    id: 0 
  });

  const [records, setRecords] = useState([
    /*{
      id: 0,
      record: {
        datetime: "1970-01-01T00:00:00.000Z",
        place: "",
        memo: ""
      }
    }*/
  ])

  const getRecord = e => {
    e.preventDefault();
    fetch(`${BASE_URL}/records/${id}`)
      .then(res => res.json())
      .then(data => setRecords([data]));
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
        <Form setId={setId} getRecord={getRecord} getRecords={getRecords} />
        <Results records={records} />
      </header>
    </div>
  );
}

export default App;

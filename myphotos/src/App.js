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

  const [record, setRecord] = useState({
    record: {
      datetime: "",
      place: "",
      memo: ""
    }
  });

  const [records, setRecords] = useState([
    {
      id: 0,
      record: {
        datetime: "",
        place: "",
        memo: ""
      }
    }
  ])

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
        <Form setId={setId} getRecord={getRecord} getRecords={getRecords} />
        <Results records={records} />
      </header>
    </div>
  );
}

export default App;

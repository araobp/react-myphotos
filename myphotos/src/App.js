import React, { useState } from "react";  // named export
import Title from './components/Title';
import Form from './components/Form';
import Results from './components/Results';
import File from './components/File';
import './App.css';

const BASE_URL = "https://myphotos1088001.herokuapp.com";

function App() {
  
  const [id, setId] = useState({
    id: 0 
  });

  const [records, setRecords] = useState([]);

  const [recordInput, setRecordInput] = useState({});

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

  const postRecord = e => {
    e.preventDefault();
    console.log(recordInput);

    // POST /records
    const body = { place: recordInput.place, memo: recordInput.memo};
    const method = "POST";
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    console.log(body);
    fetch(`${BASE_URL}/records`, {method, headers, body})
      .then(res => res.json())
      .then(console.log)
      .catch(console.error);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Title />
        
        <Form setId={setId} getRecord={getRecord} getRecords={getRecords} />
        <Results records={records} />

        <File recordInput={recordInput} setRecordInput={setRecordInput} postRecord={postRecord} />
      </header>
    </div>
  );
}

export default App;

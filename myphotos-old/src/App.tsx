import React, { useState } from "react";  // named export
import Title from './components/Title';
import Form from './components/Form';
import Results from './components/Results';
import './App.css';

const BASE_URL: string = 'https://myphotos1088001.herokuapp.com';

export interface Record {
  datetime: string;
  place: string;
  memo: string;
  format: string;
  image: BinaryData;
}

export default function App() {

  const [records, setRecords] = useState<Record[]>([]);

  const getRecords = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${BASE_URL}/records`)
      .then(res => alert());
  }

  return (
    <div className="wrapper">
      <div className="container">
        <Title />
        <Form getRecords={getRecords} />
        <Results records={records} />
      </div>
    </div>
  );
}
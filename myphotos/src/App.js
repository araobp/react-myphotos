import React, { useState, useEffect } from "react";  // named export
import Modal from "react-modal";
import Title from './components/Title';
import Form from './components/Form';
import Records from './components/Records';
import File from './components/File';
import './App.css';

const BASE_URL = "https://myphotos1088001.herokuapp.com";

Modal.setAppElement("#root");

function App() {

  const [id, setId] = useState({
    id: 0
  });

  const [records, setRecords] = useState([]);
  const [recordInput, setRecordInput] = useState({});
  const [imageFile, setImageFile] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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
    const body = JSON.stringify({ place: recordInput.place, memo: recordInput.memo });
    const method = "POST";
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    fetch(`${BASE_URL}/records`, { method: method, headers: headers, body: body })
      .then(res => res.json())
      .then(body => {
        const id = body.id;
        const method = "POST";
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/octet-stream'
        }
        fetch(`${BASE_URL}/photos/${id}`, { method: method, headers: headers, body: imageFile })
          .then(res => {
            console.log(res.status);
          });
      });
  }

  const closeModal = () => {
    setImageUrl('');
    setModalIsOpen(false);
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  // Initialization
  useEffect(() => {
    fetch(`${BASE_URL}/records`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Title />
        <Form setId={setId} getRecord={getRecord} getRecords={getRecords} />
        <Records BASE_URL={BASE_URL} records={records} setModalOpen={setModalIsOpen} setImageUrl={setImageUrl} />
        <File recordInput={recordInput} setRecordInput={setRecordInput} setImageFile={setImageFile} postRecord={postRecord} />
        <Modal isOpen={modalIsOpen} style={customStyles}>
          <img className="contain" src={imageUrl} onClick={() => closeModal()} />
        </Modal>
      </header>
    </div>
  );
}

export default App;

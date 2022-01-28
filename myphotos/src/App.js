import React, { useState, useEffect } from "react";  // named export
import Modal from "react-modal";
import Title from './components/Title';
import Form from './components/Form';
import Records from './components/Records';
import File from './components/File';
import './App.css';

// Camera
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const BASE_URL = "https://myphotos1088001.herokuapp.com";

Modal.setAppElement("#root");

function App() {

  const [id, setId] = useState({
    id: 0
  });

  const [records, setRecords] = useState([]);
  const [recordInput, setRecordInput] = useState({});
  const [imageFile, setImageFile] = useState();
  const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [checkedRecords, setCheckedRecords] = useState([]);

  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [dataUri, setDataUri] = useState(null);

  const handleCheckedRecord = (id, isChecked) => {
    const index = checkedRecords.indexOf(id);
    if (index == -1 && isChecked) {
      checkedRecords.push(id);
    } else if (index !== -1 && !isChecked) {
      checkedRecords.splice(index, 1);
    }
    setCheckedRecords(checkedRecords);
  }

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

  const deleteCheckedRecords = e => {
    e.preventDefault();
    checkedRecords.forEach( id => {
      const method = "DELETE";
      const headers = {
        'Accept': 'application/json'
      }
      fetch(`${BASE_URL}/records/${id}`, {method: method, headers: headers})
        .then(res => {
          console.log(res.status);
        });
    });
    setCheckedRecords([]);
  }

  const closeImagePopUp = () => {
    setImageUrl('');
    setImagePopUpIsOpen(false);
  }

  const closeCamera = () => {
    setCameraIsOpen(false);
  }

  const handleTakePhoto = dataUri => {
    setDataUri(dataUri);
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
    <div className="default">
      <Title />
      <Form setId={setId} getRecord={getRecord} getRecords={getRecords} />
      <Records BASE_URL={BASE_URL} records={records} setModalOpen={setImagePopUpIsOpen} setImageUrl={setImageUrl} checkedRecords={checkedRecords} handleCheckedRecord={handleCheckedRecord} deleteCheckedRecords={deleteCheckedRecords}/>
      <File recordInput={recordInput} setRecordInput={setRecordInput} setImageFile={setImageFile} postRecord={postRecord} />
      <Modal isOpen={imagePopUpIsOpen} style={customStyles}>
        <img className="contain" src={imageUrl} onClick={() => closeImagePopUp()} />
      </Modal>
      <Modal isOpen={cameraIsOpen} style={customStyles}>
        <button onClick={closeCamera}>Close camera</button>
        <img src={dataUri}/>
        <Camera  onTakePhoto = { dataUri => {handleTakePhoto(dataUri)}} />
      </Modal>
      <button onClick={() => setCameraIsOpen(true)}>Take photo</button>
    </div>
  );
}

export default App;

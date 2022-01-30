import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import '../App.css';


import { Form } from './Form';
import { Records }from './Records';

export const AlbumPage = () => {

    Modal.setAppElement("#root");

    const [id, setId] = useState({
        id: 0
      });    
    const [records, setRecords] = useState([]);
    const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [checkedRecords, setCheckedRecords] = useState([]);

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
        fetch(`${process.env.REACT_APP_BASE_URL}/records/${id}`)
            .then(res => res.json())
            .then(data => setRecords([data]));
    }

    const getRecords = e => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_BASE_URL}/records`)
            .then(res => res.json())
            .then(data => setRecords(data));
    }

    const deleteCheckedRecords = e => {
        e.preventDefault();
        checkedRecords.forEach(id => {
            const method = "DELETE";
            const headers = {
                'Accept': 'application/json'
            }
            fetch(`${process.env.REACT_APP_BASE_URL}/records/${id}`, { method: method, headers: headers })
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
        fetch(`${process.env.REACT_APP_BASE_URL}/records`)
            .then(res => res.json())
            .then(data => setRecords(data));
    }, []);

    return (
        <div>
            <Form setId={setId} getRecord={getRecord} getRecords={getRecords} />
            <Records records={records} setModalOpen={setImagePopUpIsOpen} setImageUrl={setImageUrl} checkedRecords={checkedRecords} handleCheckedRecord={handleCheckedRecord} deleteCheckedRecords={deleteCheckedRecords} />
            <Modal isOpen={imagePopUpIsOpen} style={customStyles}>
                <img className="contain" src={imageUrl} onClick={() => closeImagePopUp()} />
            </Modal>
        </div>
    );
};

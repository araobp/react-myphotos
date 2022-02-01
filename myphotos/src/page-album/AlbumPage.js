import React, { useState, useEffect } from "react";

import { Records }from './Records';

export const AlbumPage = () => {

    const [id, setId] = useState({
        id: 0
      });    
    const [records, setRecords] = useState([]);
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
            .then(data => {
                setRecords(data);
                console.log(data);
            });
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

    // Initialization
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/records`)
            .then(res => res.json())
            .then(data => setRecords(data));
    }, []);

    return (
        <div>
            <Records records={records} getRecords={getRecords} checkedRecords={checkedRecords} handleCheckedRecord={handleCheckedRecord} deleteCheckedRecords={deleteCheckedRecords} />
        </div>
    );
};

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { styleModal } from "../components-common/styles";
import { GeoLocation } from '../components-common/GeoLocation';

export const AlbumPage = () => {

    Modal.setAppElement("#root");

    const [id, setId] = useState({
        id: 0
    });
    const [records, setRecords] = useState([]);
    const [checkedRecords, setCheckedRecords] = useState([]);
    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState({});

    const openImage = (id) => {
        setImageURL(`${process.env.REACT_APP_BASE_URL}/photos/${id}/image`);
        setShowImage(true);
    }

    const openMap = (latitude, longitude) => {
        setLocation({ latitude: latitude, longitude: longitude });
        setShowMap(true);
    }

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
        <>
            <div className="default">
                <div>
                    <Modal isOpen={showImage} style={styleModal}>
                        <img src={imageURL} className="content" />
                        <button className="small-button" onClick={() => setShowImage(false)}>Close</button>
                    </Modal>
                    <Modal isOpen={showMap} style={styleModal}>
                        <GeoLocation latitude={location.latitude} longitude={location.longitude} />
                        <button className="small-button" onClick={() => setShowMap(false)}>Close</button>
                    </Modal>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>id</th>
                                <th>datetime</th>
                                <th>place</th>
                                <th>memo</th>
                                <th>map</th>
                                <th>thumbnail</th>
                            </tr>
                        </thead>
                        {records.map((r, index) => (
                            <tbody key={r.id}>
                                <tr>
                                    <td><input type="checkbox" defaultChecked={(checkedRecords.indexOf(r.id) == -1) ? false : true} onChange={(e) => handleCheckedRecord(r.id, e.target.checked)} /></td>
                                    <td>{r.id}</td>
                                    <td>{new Date(r.record.datetime).toLocaleString()}</td>
                                    <td>{r.record.place}</td>
                                    <td>{r.record.memo}</td>
                                    <td><button onClick={() => openMap(r.record.latitude, r.record.longitude)}>Map</button></td>
                                    <td><img src={`${process.env.REACT_APP_BASE_URL}/photos/${r.id}/thumbnail`} onClick={() => openImage(r.id)} /></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
            <div className="footer">
                <button className="small-button" type="submit" onClick={getRecords}>Refresh</button>
                <button className="small-button" type="submit" onClick={deleteCheckedRecords}>Delete</button>
            </div>
        </>
    );
};

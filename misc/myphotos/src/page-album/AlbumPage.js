import React, { useState, useEffect } from "react";
import Modal from "react-modal";

import { authHeaders } from "../util/auth";

import { styleModal } from "../components-common/styles";

import { GeoLocation } from '../components-common/GeoLocation';

export const AlbumPage = () => {

    Modal.setAppElement("#root");

    const [records, setRecords] = useState([]);
    const [checkedRecords, setCheckedRecords] = useState([]);
    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState({});
    const [thumbnails, setThumbnails] = useState({});

    const apiOpenImage = (id) => {
        setImageURL(null);
        const method = "GET";
        const headers = {
            ...{ 'Accept': 'application/octet-stream' },
            ...authHeaders
        }
        fetch(`${process.env.REACT_APP_BASE_URL}/photos/${id}/image`, {method: method, headers: headers})
        .then(res => res.blob())
        .then(data => setImageURL(URL.createObjectURL(data)));     
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

    const apiGetRecords = () => {
        const method = "GET";
        const headers = {
            ...{ 'Accept': 'application/json' },
            ...authHeaders
        };
        fetch(`${process.env.REACT_APP_BASE_URL}/records`, { method: method, headers: headers })
            .then(res => res.json())
            .then(rec => {
                setRecords(rec);
                apiGetThumbnails(rec);
            });
    }

    const apiDeleteCheckedRecords = async () => {
        const method = "DELETE";
        const headers = {
            ...{ 'Accept': 'application/json' },
            ...authHeaders
        };
        await Promise.all(checkedRecords.map(async id => {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/records/${id}`, { method: method, headers: headers });
            console.log(`status: ${res.status}`);
        }));
        setCheckedRecords([]);
        apiGetRecords();
    }

    const apiGetThumbnails = async (rec) => {
        const method = "GET";
        const headers = {
            ...{ 'Accept': 'application/octet-stream' },
            ...authHeaders
        };
        const t = {};
        await Promise.all(rec.map(async r => {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/photos/${r.id}/thumbnail`, { method: method, headers: headers });
            const data = await res.blob();
            t[`id_${r.id}`] = URL.createObjectURL(data);
        }));
        setThumbnails(t);
    }

    // Initialization
    useEffect(() => {
        apiGetRecords();
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
                    <div id="album">Album</div>
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
                                    <td><button className="tiny-button" onClick={() => openMap(r.record.latitude, r.record.longitude)}>Map</button></td>
                                    <td><img src={thumbnails[`id_${r.id}`]} onClick={() => apiOpenImage(r.id)} /></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
            <div className="footer">
                <button className="small-button" type="submit" onClick={e => apiDeleteCheckedRecords()}>Delete</button>
            </div>
        </>
    );
};

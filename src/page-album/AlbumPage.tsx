import { useState, useEffect } from "react";
import Modal from "react-modal";

import { authHeaders, baseURL } from "../util/auth";
import { RecordResponse, LatLon, Thumbnails } from "../components-common/structure";

import { GeoLocation } from '../components-common/GeoLocation';

export const AlbumPage = () => {

    Modal.setAppElement("#root");

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [checkedRecords, setCheckedRecords] = useState<Array<number>>([]);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string>("");
    const [showMap, setShowMap] = useState<boolean>(false);
    const [location, setLocation] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [thumbnails, setThumbnails] = useState<Thumbnails>({});
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const apiOpenImage = (id: number) => {
        setImageURL("");
        const method = "GET";
        const headers = {
            ...{ 'Accept': 'application/octet-stream' },
            ...authHeaders
        }
        fetch(`${baseURL}/photos/${id}/image`, { method: method, headers: headers })
            .then(res => res.blob())
            .then(data => setImageURL(URL.createObjectURL(data)));
        setShowImage(true);
    }

    const openMap = (latitude: number, longitude: number) => {
        setLocation({ latitude: latitude, longitude: longitude });
        setShowMap(true);
    }

    const handleCheckedRecord = (id: number, isChecked: boolean) => {
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
        fetch(`${baseURL}/records`, { method: method, headers: headers })
            .then(res => res.json())
            .then(rec => {
                setRecords(rec);
                apiGetThumbnails(rec);
            });
    }

    const deleteCheckedRecords = (confirmed: boolean) => {
        setShowConfirm(false);
        if (confirmed) {
            apiDeleteCheckedRecords();
        }
    }

    const apiDeleteCheckedRecords = async () => {
        const method = "DELETE";
        const headers = {
            ...{ 'Accept': 'application/json' },
            ...authHeaders
        };
        await Promise.all(checkedRecords.map(async id => {
            const res = await fetch(`${baseURL}/records/${id}`, { method: method, headers: headers });
            console.log(`status: ${res.status}`);
        }));
        setCheckedRecords([]);
        apiGetRecords();
    }

    const apiGetThumbnails = async (rec: Array<RecordResponse>) => {
        const method = "GET";
        const headers = {
            ...{ 'Accept': 'application/octet-stream' },
            ...authHeaders
        };
        const t: { [k: string]: string } = {};
        await Promise.all(rec.map(async (r: RecordResponse) => {
            if (r.id) {
                const res = await fetch(`${baseURL}/photos/${r.id}/thumbnail`, { method: method, headers: headers });
                const data = await res.blob();
                t[`id_${r.id}`] = URL.createObjectURL(data);
            }
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
                    <Modal isOpen={showImage} className="center-img">
                        <img src={imageURL} onClick={() => setShowImage(false)} style={{ width: "100vw", height: "100vh" }} />
                    </Modal>
                    <Modal isOpen={showMap} className="center">
                        <GeoLocation latitude={location.latitude} longitude={location.longitude} />
                        <button className="small-button" onClick={() => setShowMap(false)}>Close</button>
                    </Modal>
                    <Modal isOpen={showConfirm} className="center">
                        <div className="popup">
                            <p>Do you really want to delete these records?</p>
                            <div className="row">
                                <button className="small-button-cancel" onClick={() => deleteCheckedRecords(false)}>Cancel</button>
                                <button className="small-button-confirm" onClick={() => deleteCheckedRecords(true)}>Delete</button>
                            </div>
                        </div>
                    </Modal>
                    <div className="title">Album</div>
                    <div>
                        {records.map((r, index) => (
                            <div key={r.id} className="card">
                                <input className="card-checkbox" type="checkbox" defaultChecked={r.id && (checkedRecords.indexOf(r.id) == -1) ? false : true} onChange={(e) => handleCheckedRecord(r.id, e.target.checked)} />
                                <img className="card-img" src={thumbnails[`id_${r.id}`]} onClick={() => apiOpenImage(r.id)} />
                                <div className="card-text">
                                    <div>Date: {new Date(r.datetime as string).toLocaleString()}</div>
                                    <div>Place: {r.place}</div>
                                    <div>Memo: {r.memo}</div>
                                </div>
                                <div className="card-map">
                                    <button className="tiny-button" onClick={() => openMap(r.latitude, r.longitude)}>Map</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="footer">
                <button className="small-button" type="submit" onClick={e => setShowConfirm(true)}>Delete</button>
            </div>
        </>
    );
};

import { useState, useEffect } from "react";
import Modal from "react-modal";

import { authHeaders, baseURL } from "../util/auth";
import { RecordResponse, LatLon, Thumbnails } from "../components-common/structure";
import { PopUpConfirm } from "../components-common/PopUpMessage";
import { PopUpMap } from '../components-common/PopUpMap';
import { RecordForm } from "../components-common/RecordForm";

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

    const [longTouch, setLongTouch] = useState<number[]>([]);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [place, setPlace] = useState<string>("");
    const [memo, setMemo] = useState<string>("");
    const [record, setRecord] = useState<RecordResponse | null>(null);

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

    /*** Edit ***/

    const removeId = (id: number) => setLongTouch(longTouch.filter(i => i != id));

    const handleTouchStart = (r: RecordResponse) => {
        setLongTouch([...longTouch, r.id]);
        const timer = setTimeout(() => {
            initiateEdit(r);
        }, 1000);
    }

    const handleTouchEnd = (r: RecordResponse) => removeId(r.id);

    const initiateEdit = (r: RecordResponse) => {
        if (longTouch.includes(r.id)) {
            setLongTouch(longTouch.filter(i => i != r.id));
            setPlace(r.place);
            setMemo(r.memo);
        }
        setRecord(r);
        setShowInput(true);
    }

    const handleDoubleClick = (r: RecordResponse) => {
        setLongTouch(longTouch.filter(i => i != r.id));
        setPlace(r.place);
        setMemo(r.memo);
        setRecord(r);
        setShowInput(true);
    }

    const updateRecord = () => {
        setShowInput(false);
        // Update
    }

    return (
        <>
            <div className="default">
                <div>
                    <Modal isOpen={showImage} className="center-img">
                        <img src={imageURL} onClick={() => setShowImage(false)} style={{ width: "100vw", height: "100vh" }} />
                    </Modal>

                    <Modal isOpen={showInput} className="center">
                        <div className="popup">
                            <RecordForm place={place} setPlace={setPlace} memo={memo} setMemo={setMemo} />
                            <div className="row">
                                <button className="small-button" onClick={e => updateRecord()}>Done</button>
                                <button className="small-button-cancel" onClick={e => setShowInput(false)}>Cancel</button>
                            </div>
                        </div>
                    </Modal>

                    <PopUpMap isOpen={showMap} setIsOpen={setShowMap} latlon={location} />

                    <PopUpConfirm isOpen={showConfirm} message="Do you really want to delete these records?"
                        callback={confirmed => deleteCheckedRecords(confirmed)} />

                    <div className="title">Album</div>
                    <div>
                        {records.map((r, _) => (
                            <div key={r.id} className="card">
                                <input className="card-checkbox" type="checkbox" defaultChecked={r.id && (checkedRecords.indexOf(r.id) == -1) ? false : true} onChange={(e) => handleCheckedRecord(r.id, e.target.checked)} />
                                <img className="card-img" src={thumbnails[`id_${r.id}`]} onClick={() => apiOpenImage(r.id)} />
                                <div className="card-text" onDoubleClick={e => handleDoubleClick(r)} onTouchStart={e => handleTouchStart(r)} onTouchEnd={e => handleTouchEnd(r)} >
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

import { useState, useEffect } from "react";
import Modal from "react-modal";

import { RecordResponse, LatLon } from "../api/structure";
import { PopUpConfirm } from "../components-common/PopUpMessage";
import { PopUpMap } from "../components-common/PopUpMap";
import { PopUpImage } from "../components-common/PopUpImage";
import { RecordForm } from "../components-common/RecordForm";
import { forward, backward, LIMIT } from "../util/manipulation";
import { apiGetRecords, apiGetThumbnails, apiPutRecord, apiDeleteRecords, apiGetCount } from "../api/rest";

export const AlbumPage = () => {

    Modal.setAppElement("#root");

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [checkedRecords, setCheckedRecords] = useState<Array<number>>([]);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [location, setLocation] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const [showInput, setShowInput] = useState<boolean>(false);
    const [place, setPlace] = useState<string>("");
    const [memo, setMemo] = useState<string>("");
    const [id, setId] = useState<number | null>(null);

    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const [keyword, setKeyword] = useState<string>("");

    const openImage = (id: number) => {
        setId(id);
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

    const deleteCheckedRecords = async (confirmed: boolean) => {
        setShowConfirm(false);
        try {
            if (confirmed) {
                await apiDeleteRecords(checkedRecords);
            }
        } catch (e) {
            console.log(e);
        } finally {
            updateRecordTable();
            setCheckedRecords([]);
        }
    }

    const updateRecordTable = () => {
        apiGetCount()
        .then(cnt => {
            setCount(cnt);
            return apiGetRecords(LIMIT, offset)
        })
        .then(r => {
            setRecords(r);
            return apiGetThumbnails(r);
        })
        .then (t => setThumbnails(t))
        .catch(e => console.trace(e));
    }

    // Initialization
    useEffect(() => {
        updateRecordTable();
    }, []);

    useEffect(() => {
        updateRecordTable();
    }, [offset]);

    /*** Edit ***/

    const handleOnClick = (r: RecordResponse) => {
        setId(r.id);
        setPlace(r.place);
        setMemo(r.memo);
        setShowInput(true);
    }

    const updateRecord = () => {
        setShowInput(false);
        if (id != null) {
            setId(null);
            apiPutRecord(id, place, memo)
            .then(_ => updateRecordTable())
            .catch(e => console.log(e));
        }
    }

    return (
        <>
            <div className="default">
                <div>
                    {id && <PopUpImage showImage={showImage} setShowImage={setShowImage} id={id}></PopUpImage>}

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

                    <div className="row-space-between">
                        <div>
                            <input
                                type="text"
                                style={{ width: "50vw" }}
                                placeholder="Search key word..."
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                            />
                            <button className="tiny-button" type="submit" onClick={e => setKeyword("")}>Clear</button>
                        </div>
                        <div style={{ width: "1rem" }}></div>
                        <button className="tiny-button" style={{ fontSize: "0.8rem" }} type="submit" onClick={e => setShowConfirm(true)}>Delete</button>
                    </div>

                    <div>
                        {records
                            .filter(r => r.place.includes(keyword) || r.memo.includes(keyword))
                            .map((r, _) => (
                                <div key={r.id} className="card">
                                    <input className="card-checkbox" type="checkbox" defaultChecked={r.id && (checkedRecords.indexOf(r.id) == -1) ? false : true} onChange={(e) => handleCheckedRecord(r.id, e.target.checked)} />
                                    <img className="card-img" src={thumbnails.get(`id_${r.id}`)} onClick={() => openImage(r.id)} />
                                    <div className="card-text">
                                        <div>Date: {new Date(r.datetime as string).toLocaleString()}</div>
                                        <div>Place: {r.place}</div>
                                        <div>Memo: {r.memo}</div>
                                    </div>
                                    <div className="card-map">
                                        <button className="tiny-button" onClick={e => openMap(r.latitude, r.longitude)}>Map</button>
                                        <button className="tiny-button" style={{ marginTop: "10px" }} onClick={e => handleOnClick(r)}>Edit</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(backward(offset))}>&lt;</button>
                <div style={{ fontSize: "1.3rem" }}>{offset + 1}/{count}</div>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset, count))}>&gt;</button>
            </div>
        </>
    );
}

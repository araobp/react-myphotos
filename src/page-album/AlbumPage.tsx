import { useState, useEffect, FC } from "react";
import Modal from "react-modal";

import { RecordResponse, LatLon } from "../api-myphotos/structure";
import { PopUpConfirm } from "../components-common/PopUpMessage";
import { PopUpMap } from "../components-common/PopUpMap";
import { PopUpImage } from "../components-common/PopUpImage";
import { RecordForm } from "../components-common/RecordForm";
import { LIMIT } from "../util/constants";
import { apiGetRecords, apiGetThumbnails, apiPutRecord, apiDeleteRecords, apiGetRecordCount, apiGetImage, apiGetPhotoAttribute } from "../api-myphotos/myphotos";
import { toLocalTime } from "../util/convert";
import { PhotoFooter } from "../components-common/PhotoFooter";
import { Panorama } from "../panolens/Panorama";
import { CloseFooter } from "../components-common/CloseFooter";
import { modalBackgroundStyle } from "../components-common/styles";

export const AlbumPage: FC = () => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [checkedRecords, setCheckedRecords] = useState<Array<number>>([]);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [showPanorama, setShowPanorama] = useState<boolean>(false);
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

    const openPhotoViewer = (id: number) => {
        setId(id);
        apiGetPhotoAttribute(id)
            .then(photoAttribute => {
                console.log(photoAttribute);
                if (photoAttribute.equirectangular) {
                    setShowPanorama(true);
                } else {
                    setShowImage(true);
                }
            })
            .catch(e => {  // Note: in case a equirectangular value is not present in the row of the table
                setShowImage(true);
            });
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
        apiGetRecordCount()
            .then(cnt => {
                setCount(cnt);
                return apiGetRecords(LIMIT, offset)
            })
            .then(r => {
                setRecords(r);
                return apiGetThumbnails(r);
            })
            .then(t => setThumbnails(t))
            .catch(e => console.trace(e));
    }

    const onClosePanorama = () => setShowPanorama(false);

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
                    {showImage && id && <PopUpImage onPopUpClosed={() => setShowImage(false)} id={id} />}

                    {showPanorama && id && <Panorama id={id} />}

                    <Modal isOpen={showInput} className="center" style={modalBackgroundStyle}>
                        <div className="popup">
                            <RecordForm place={place} setPlace={setPlace} memo={memo} setMemo={setMemo} />
                            <div className="row">
                                <button className="small-button" onClick={e => updateRecord()}>Done</button>
                                <button className="small-button-cancel" onClick={e => setShowInput(false)}>Cancel</button>
                            </div>
                        </div>
                    </Modal>

                    {showMap && <PopUpMap onPopUpClosed={() => setShowMap(false)} latlon={location} />}

                    {showConfirm &&
                        <PopUpConfirm message="Do you really want to delete these records?"
                            onConfirm={confirmed => deleteCheckedRecords(confirmed)} />
                    }

                    {!showPanorama &&
                        <>
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
                                            <img className="card-img" src={thumbnails.get(`id_${r.id}`)} onClick={() => openPhotoViewer(r.id)} />
                                            <div className="card-text">
                                                <div>Date: {toLocalTime(r.timestamp)}</div>
                                                <div>Address: {r.address}</div>
                                                <div>Place: {r.place}</div>
                                                <div>Memo: {r.memo}</div>
                                            </div>
                                            <div className="card-map">
                                                <button className="tiny-button-record" onClick={e => openMap(r.latitude, r.longitude)}>Map</button>
                                                <button className="tiny-button-record" style={{ marginTop: "10px" }} onClick={e => handleOnClick(r)}>Edit</button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </>
                    }
                </div>

                {!showPanorama && <PhotoFooter count={count} offset={offset} setOffset={setOffset} />}
                {showPanorama && <CloseFooter onClose={onClosePanorama} />}
            </div>
        </>
    );
}

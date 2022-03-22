import { FC, useState } from "react";
import Modal from 'react-modal';
import { apiDeleteRecords, apiPatchRecord } from "../api-myphotos/myphotos";
import { LatLon, RecordResponse } from "../api-myphotos/structure";
import { PopUpMap } from "../components-common/PopUpMap";
import { PopUpConfirm } from "../components-common/PopUpMessage";
import { RecordForm } from "../components-common/RecordForm";
import { modalBackgroundStyle } from "../components-common/styles";
import { toLocalTime } from "../util/convert";

export type CardsCompProps = {
    records: Array<RecordResponse>;
    thumbnails: Map<string, string>;
    updateRecordTable: () => void;
    openPhotoViewer: (id: number) => void;
}

export const CardsComp: FC<CardsCompProps> = ({ records, thumbnails, updateRecordTable, openPhotoViewer }) => {

    const [id, setId] = useState<number | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [location, setLocation] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [checkedRecords, setCheckedRecords] = useState<Array<number>>([]);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [place, setPlace] = useState<string>("");
    const [memo, setMemo] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");

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

    /*** Edit ***/

    const handleOnClick = (r: RecordResponse) => {
        setId(r.id);
        setPlace(r.place);
        setMemo(r.memo);
        setShowInput(true);
    }

    const updateRecord = () => {
        console.log("PATCH")
        setShowInput(false);
        if (id != null) {
            setId(null);
            apiPatchRecord(id, place, memo)
                .then(_ => updateRecordTable())
                .catch(e => console.log(e));
        }
    }

    return (
        <>
            <div className="default">
                <div>

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
                                            {r.distance && <div>Distance: {r.distance.toFixed(2)} km</div>}
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
                </div>
            </div>
        </>
    );
};
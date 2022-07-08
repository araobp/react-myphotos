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
    openPhotoViewer: (uuid: string) => void;
}

export const CardsComp: FC<CardsCompProps> = ({ records, thumbnails, updateRecordTable, openPhotoViewer }) => {

    const [uuid, setUuid] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [location, setLocation] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [checkedRecords, setCheckedRecords] = useState<Array<string>>([]);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [memo, setMemo] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");

    const openMap = (latitude: number, longitude: number) => {
        setLocation({ latitude: latitude, longitude: longitude });
        setShowMap(true);
    }

    const handleCheckedRecord = (uuid: string, isChecked: boolean) => {
        const index = checkedRecords.indexOf(uuid);
        if (index === -1 && isChecked) {
            checkedRecords.push(uuid);
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
        setUuid(r.uuid__c);
        setName(r.name);
        setMemo(r.memo__c);
        setShowInput(true);
    }

    const updateRecord = () => {
        //console.log("PATCH")
        setShowInput(false);
        if (uuid != null) {
            apiPatchRecord(uuid, name, memo)
                .then(_ => updateRecordTable())
                .catch(e => console.log(e))
                .finally(()=>setUuid(null));
        }
    }

    return (
        <>
            <div className="default">
                <div>

                    <Modal isOpen={showInput} className="center" style={modalBackgroundStyle}>
                        <div className="popup">
                            <RecordForm name={name} setName={setName} memo={memo} setMemo={setMemo} />
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
                                .filter(r => r.name.includes(keyword) || r.memo__c.includes(keyword))
                                .map((r, _) => (
                                    <div key={r.uuid__c} className="card">
                                        <input className="card-checkbox" type="checkbox" defaultChecked={r.uuid__c && (checkedRecords.indexOf(r.uuid__c) === -1) ? false : true} onChange={(e) => handleCheckedRecord(r.uuid__c, e.target.checked)} />
                                        <img alt="thumbnail" className="card-img" src={thumbnails.get(`id_${r.uuid__c}`)} onClick={() => openPhotoViewer(r.uuid__c)} />
                                        <div className="card-text">
                                            <div>Date: {toLocalTime(r.timestamp__c)}</div>
                                            <div>Address: {r.address__c}</div>
                                            <div>Name: {r.name}</div>
                                            {r.distance && <div>Distance: {r.distance.toFixed(2)} km</div>}
                                            <div>Memo: {r.memo__c}</div>
                                        </div>
                                        <div className="card-map">
                                            <button className="tiny-button-record" onClick={e => openMap(r.geolocation__latitude__s, r.geolocation__longitude__s)}>Map</button>
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
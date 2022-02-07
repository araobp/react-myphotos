import { useState, useEffect } from "react";
import '../App.css';
import Modal from "react-modal";

import { dataURItoArrayBuffer } from '../util/convert';
import { authHeaders, baseURL } from "../util/auth";

import { RecordRequest, LatLon } from "../components-common/structure";
import { CameraComp } from './CameraComp';
import { GeoLocation } from '../components-common/GeoLocation';

export const HomePage = () => {

    Modal.setAppElement("#root");

    const [location, setLocation] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [place, setPlace] = useState<string>(localStorage.getItem("place") || "");
    const [memo, setMemo] = useState<string>(localStorage.getItem("memo") || "");
    const [showInputFile, setShowInputFile] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [dataURI, setDataURI] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [showProgress, setShowProgress] = useState<boolean>(false);

    /*** Geo-location ***********************************************/
    const startWatchingLocation = () => {
        const id = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
        });
        setWatchId(id);
    };

    const stopWatchingLocation = () => {
        watchId && navigator.geolocation.clearWatch(watchId);
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            startWatchingLocation();
        }
        return () => { stopWatchingLocation() };
    }, []);

    /*** Upload a record ****************************************/
    const apiPostRecord = () => {
        setShowProgress(true);

        // Save parameters
        localStorage.setItem("place", place);
        localStorage.setItem("memo", memo)

        // POST /records
        const record: RecordRequest = { place: place, memo: memo, latitude: 0.0, longitude: 0.0 };
        if (location) {
            record.latitude = location.latitude;
            record.longitude = location.longitude;
        }
        const body = JSON.stringify(record);
        console.log(body);
        const method: string = "POST";
        const headers = {
            ...{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...authHeaders
        };
        fetch(`${baseURL}/records`, { method: method, headers: headers, body: body })
            .then(res => res.json())
            .then(body => {
                if (dataURI) {
                    const id = body.id;
                    const method = "POST";
                    const headers = {
                        ...{
                            'Accept': 'application/json',
                            'Content-Type': 'application/octet-stream'
                        },
                        ...authHeaders
                    }
                    fetch(
                        `${baseURL}/photos/${id}`,
                        { method: method, headers: headers, body: dataURItoArrayBuffer(dataURI) }
                    )
                        .then(res => {
                            console.log(res.status);
                            setShowProgress(false);
                        });
                } else {
                    setShowProgress(false);
                }
            });
    }

    const handleChange = (f: File | null) => {
        if (f) {
            const reader = new FileReader();
            reader.onload = e => {
                setDataURI(reader.result as string);
            };
            reader.readAsDataURL(f);
        }
    }

    const clearInputFields = () => {
        setPlace("");
        setMemo("");
        setDataURI(null);
    }

    return (
        <div>
            {!showCamera &&
                <div className="default">
                    <div className="title">Home</div>
                    {location &&
                        <p className="latlon">Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}</p>
                        || <p className="latlon">Positioning...</p>
                    }
                    <div>
                        <div id="place">
                            <label>Place:
                                <input
                                    type="text"
                                    name="place"
                                    value={place}
                                    onChange={e => setPlace(e.target.value)}
                                />
                            </label>
                        </div>

                        <div id="memo">
                            <div>Memo:</div>
                            <textarea id="memo-input"
                                name="memo"
                                value={memo}
                                onChange={e => setMemo(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {showInputFile &&
                            <div>
                                <label>Image file:
                                    <input
                                        type="file"
                                        name="imageFile"
                                        className="input-file"
                                        onChange={e => { e.target.files && handleChange(e.target.files[0]) }}
                                    />
                                </label>
                            </div>
                        }

                        {dataURI && <img id="img-temp" src={dataURI} width="35%" />}

                        <div>
                            <button className="small-button" type="submit" onClick={() => setShowCamera(true)}>Camera</button>
                            <button className="small-button" type="submit" onClick={() => setShowInputFile(!showInputFile)}>File</button>
                        </div>
                    </div>
                </div>
            }

            {
                !showCamera &&
                <div className="footer">
                    <button className="small-button" type="submit" onClick={() => setShowMap(true)}>Map</button>
                    <button className="small-button" type="submit" onClick={e => apiPostRecord()}>Upload</button>
                    <button className="small-button" type="submit" onClick={clearInputFields}>Clear</button>
                </div>
            }

            {
                showCamera &&
                <div>
                    <CameraComp setDataURI={setDataURI} setShowCameraFlag={setShowCamera} />
                </div>
            }

            {
                location &&
                <Modal isOpen={showMap} className="center">
                    <div>
                        <GeoLocation latitude={location.latitude} longitude={location.longitude} />
                        <button className="small-button" style={{ color: "white" }} onClick={() => setShowMap(false)}>Close</button>
                    </div>
                </Modal>
            }

            <Modal isOpen={showProgress} className="center">
                <div className="popup">
                    <p>Uploading the record to the cloud...</p>
                </div>
            </Modal>

        </div >
    );
};

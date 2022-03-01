import { useState, useEffect, FC } from "react";
import '../App.css';
import Modal from "react-modal";

import { LatLon } from "../api/structure";
import { RecordForm } from "../components-common/RecordForm";
import { CameraComp } from './CameraComp';
import { PopUpMap } from '../components-common/PopUpMap';
import { PopUp } from "../components-common/PopUpMessage";
import { apiPostGpsLog, apiPostRecord } from "../api/rest";
import { PERIOD } from "../util/constants";

export const HomePage: FC = () => {

    const [latlon, setLatLon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [picLatlon, setPicLatlon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [place, setPlace] = useState<string>(localStorage.getItem("place") || "");
    const [memo, setMemo] = useState<string>(localStorage.getItem("memo") || "");
    const [showInputFile, setShowInputFile] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [dataURI, setDataURI] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [showReject, setShowReject] = useState<boolean>(false);
    const [gpsLoggingEnabled, setGpsLoggingEnabled] = useState<boolean>(false);
    const [lastGpsLogPostTime, setLastGpsLogPostTime] = useState<Date>(new Date());
    const [session, setSession] = useState<number | null>(null);

    Modal.setAppElement("#root");

    /*** Geo-location ***********************************************/
    const startWatchingLocation = (gpsLoggingEnabled: boolean) => {
        const id = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            setLatLon({ latitude, longitude });
        });
        setWatchId(id);
    };

    const stopWatchingLocation = () => {
        watchId && navigator.geolocation.clearWatch(watchId);
        setSession(null);
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            startWatchingLocation(false);
        }
        return () => {
            stopWatchingLocation();
        };
    }, []);

    useEffect(() => {
        if (gpsLoggingEnabled) {
            const now = new Date();
            if ((now.getTime() - lastGpsLogPostTime.getTime()) > PERIOD) {
                const gpsLogRequest = { ...latlon, ...{ session: session } };
                apiPostGpsLog(gpsLogRequest)
                    .then(id => {
                        console.log(id);
                        setLastGpsLogPostTime(now);
                        if (session == null) setSession(id);
                    });
            }
        }
    }, [latlon]);

    /*** Upload a record ****************************************/
    const postRecord = async () => {
        if (dataURI) {
            setShowProgress(true);

            // Save parameters
            localStorage.setItem("place", place);
            localStorage.setItem("memo", memo);

            await apiPostRecord(place, memo, picLatlon, dataURI);
            setShowProgress(false);
        } else {
            setShowReject(true);
            setTimeout(() => setShowReject(false), 2000);
        }
    }

    const handleChange = (f: File | null) => {
        if (f) {
            const reader = new FileReader();
            reader.onload = e => {
                picTaken(reader.result as string);
            };
            reader.readAsDataURL(f);
        }
    }

    const clearInputFields = () => {
        setPlace("");
        setMemo("");
        setDataURI(null);
    }

    const picTaken = (dataURI: string | null) => {
        setPicLatlon(latlon);
        setDataURI(dataURI);
    }

    const enableGpsLogging = (enabled: boolean) => {
        stopWatchingLocation();
        setGpsLoggingEnabled(enabled);
        startWatchingLocation(enabled);
    }

    return (
        <>
            {!showCamera &&
                <div className="default" style={{ padding: "1vw" }}>
                    {(latlon.latitude !== 0) && (latlon.longitude !== 0) &&
                        <p className="latlon">Latitude: {latlon.latitude.toFixed(6)}, Longitude: {latlon.longitude.toFixed(6)}</p>
                        || <p className="latlon">Positioning...</p>
                    }

                    <RecordForm place={place} setPlace={setPlace} memo={memo} setMemo={setMemo} />

                    <div>
                        {dataURI && <img id="img-temp" src={dataURI} width="35%" />}
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

                    <div>
                        <button
                            className="small-button"
                            type="submit"
                            onClick={() => setShowCamera(true)}>Camera
                        </button>
                        {localStorage.getItem("fileUploadEnabled") == "true" &&
                            <button
                                className="small-button"
                                type="submit"
                                onClick={() => setShowInputFile(!showInputFile)}>File
                            </button>
                        }
                    </div>
                </div>
            }

            {
                !showCamera &&
                <div className="footer">
                    <button className="small-button" type="submit" onClick={() => setShowMap(true)}>Map</button>
                    <button className="small-button" type="submit" onClick={e => postRecord()}>Upload</button>
                    <button className="small-button" type="submit" onClick={clearInputFields}>Clear</button>
                </div>
            }

            <CameraComp isOpen={showCamera} setIsOpen={setShowCamera} picTaken={picTaken} />

            <PopUpMap isOpen={showMap} setIsOpen={setShowMap} latlon={latlon} />

            <PopUp isOpen={showProgress} isAlert={false} message={'Uploading the record to the cloud...'} />

            <PopUp isOpen={showReject} isAlert={true} message={'Uploading rejected: no imaga data'} />
        </>
    );
};

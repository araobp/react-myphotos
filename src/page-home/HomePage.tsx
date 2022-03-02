import { useState, useEffect, FC, useRef } from "react";
import '../App.css';
import Modal from "react-modal";

import { LatLon } from "../api-myphotos/structure";
import { RecordForm } from "../components-common/RecordForm";
import { CameraComp } from './CameraComp';
import { PopUpMap } from '../components-common/PopUpMap';
import { PopUp } from "../components-common/PopUpMessage";
import { apiPostGpsLog, apiPostRecord } from "../api-myphotos/myphotos";
import { PERIOD } from "../util/constants";
import { apiGetAddressByLocation } from "../api-nominatim/nominatim";

export const HomePage: FC = () => {

    const [latlon, setLatLon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [picLatlon, setPicLatlon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [address, setAddress] = useState<string>("");
    const [picAddress, setPicAddress] = useState<string>("");
    const [place, setPlace] = useState<string>(localStorage.getItem("place") || "");
    const [memo, setMemo] = useState<string>(localStorage.getItem("memo") || "");
    const [showInputFile, setShowInputFile] = useState<boolean>(false);
    const [showWebcam, setShowWebcam] = useState<boolean>(false);
    const [dataURI, setDataURI] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [showReject, setShowReject] = useState<boolean>(false);
    const [gpsLoggingEnabled, setGpsLoggingEnabled] = useState<boolean>(false);
    const [lastGpsLogPostTime, setLastGpsLogPostTime] = useState<Date>(new Date());
    const [session, setSession] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    Modal.setAppElement("#root");

    /*** Geo-location ***********************************************/
    const startWatchingLocation = (gpsLoggingEnabled: boolean) => {
        const id = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            setLatLon({ latitude, longitude });
            lookUpAddressByLocation(latitude, longitude);
        });
        setWatchId(id);
    };

    const stopWatchingLocation = () => {
        watchId && navigator.geolocation.clearWatch(watchId);
        setSession(null);
    };

    const lookUpAddressByLocation = (latitude: number, longitude: number) => {
        apiGetAddressByLocation(latitude, longitude)
            .then(address => setAddress(address))
            .catch(e => console.log(e));
    }

    const onFileButtonClick = () => {
        setShowInputFile(true);
        inputRef?.current?.click();
    }

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

            await apiPostRecord(place, memo, picLatlon, picAddress, dataURI);
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
                setPicAddress("");
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
        setPicAddress(address);
        setDataURI(dataURI);
    }

    const enableGpsLogging = (enabled: boolean) => {
        stopWatchingLocation();
        setGpsLoggingEnabled(enabled);
        startWatchingLocation(enabled);
    }

    return (
        <>
            {!showWebcam &&
                <div className="default" style={{ padding: "1vw" }}>
                    {(latlon.latitude !== 0) && (latlon.longitude !== 0) &&
                        <>
                            <div className="latlon">Latitude: {latlon.latitude.toFixed(6)}, Longitude: {latlon.longitude.toFixed(6)}</div>
                            <div className="latlon">{address}</div>
                        </>
                        || <div className="latlon">Positioning...</div>
                    }

                    <RecordForm place={place} setPlace={setPlace} memo={memo} setMemo={setMemo} />

                    <div>
                        {dataURI && <img id="img-temp" src={dataURI} width="35%" />}
                    </div>

                    <input style={{ width: 0, height: 0 }}
                        type="file"
                        name="imageFile"
                        className="input-file"
                        accept="image/*"
                        capture="environment"
                        ref={inputRef}
                        onChange={e => { e.target.files && handleChange(e.target.files[0]) }}
                    />

                    <>
                        {localStorage.getItem("webcamEnabled") == "true" &&
                            <button
                                className="small-button"
                                type="submit"
                                onClick={() => setShowWebcam(true)}>WebCam
                            </button>
                        }
                        <button
                            className="small-button"
                            type="submit"
                            onClick={() => onFileButtonClick()}>Camera
                        </button>
                    </>
                </div>
            }

            {
                !showWebcam &&
                <div className="footer">
                    <button className="small-button" type="submit" onClick={() => setShowMap(true)}>Map</button>
                    <button className="small-button" type="submit" onClick={e => postRecord()}>Upload</button>
                    <button className="small-button" type="submit" onClick={clearInputFields}>Clear</button>
                </div>
            }

            <CameraComp isOpen={showWebcam} setIsOpen={setShowWebcam} picTaken={picTaken} />

            {showMap && <PopUpMap setIsOpen={setShowMap} latlon={latlon} />}

            {showProgress && <PopUp isAlert={false} message={'Uploading the record to the cloud...'} />}

            {showReject && <PopUp isAlert={true} message={'Uploading rejected: no imaga data'} />}
        </>
    );
};

import { useState, useEffect, FC, useRef } from "react";
import '../App.css';
import Modal from "react-modal";

import { LatLon } from "../api-myphotos/structure";
import { RecordForm } from "../components-common/RecordForm";
import { CameraComp } from './CameraComp';
import { PopUpMap } from '../components-common/PopUpMap';
import { PopUp } from "../components-common/PopUpMessage";
import { apiPostRecord } from "../api-myphotos/myphotos";
import { apiGetAddressByLocation } from "../api-nominatim/nominatim";
import { WEBCAM_EABLED } from "../util/constants";

export const HomePage: FC = () => {

    const [latlon, setLatLon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [picLatlon, setPicLatlon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [address, setAddress] = useState<string>("");
    const [picAddress, setPicAddress] = useState<string>("");
    const [place, setPlace] = useState<string>(localStorage.getItem("place") || "");
    const [memo, setMemo] = useState<string>(localStorage.getItem("memo") || "");
    const [showWebcam, setShowWebcam] = useState<boolean>(false);
    const [dataURI, setDataURI] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [showReject, setShowReject] = useState<boolean>(false);

    Modal.setAppElement("#root");

    const inputRef = useRef<HTMLInputElement>(null);

    // This is to hide a "choose file" button in a HTML input element, and to lauch 
    // a mobile camera app automatically without pressing a choose file button.
    const onCameraButtonClicked = () => {
        inputRef?.current?.click();
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

    const handleChange = (f: File | null) => {
        if (f) {
            const reader = new FileReader();
            reader.onload = e => {
                picTaken(reader.result as string);
                if (WEBCAM_EABLED) setPicAddress("");  // In case of file upload
            };
            reader.readAsDataURL(f);
        }
    }

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
    };

    const lookUpAddressByLocation = (latitude: number, longitude: number) => {
        apiGetAddressByLocation(latitude, longitude)
            .then(address => setAddress(address))
            .catch(e => console.log(e));
    }

    useEffect(() => {
        if ('geolocation' in navigator) {
            startWatchingLocation(false);
        }
        return () => {
            stopWatchingLocation();
        };
    }, []);

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

                    {/*  Show a captured image */}
                    <div>
                        {dataURI && <img id="img-temp" src={dataURI} width="35%" />}
                    </div>

                    {/* Use Mobile Camera App (or read an image file in case of Mac or PC) */}
                    <input style={{ display: "none" }}
                        type="file"
                        name="imageFile"
                        className="input-file"
                        accept="image/*"
                        capture="environment"
                        ref={inputRef}
                        onChange={e => { e.target.files && handleChange(e.target.files[0]) }}
                    />

                    {WEBCAM_EABLED &&
                        <div>
                            <button
                                className="small-button"
                                type="submit"
                                onClick={() => setShowWebcam(true)}>WebCam
                            </button>
                            <button
                                className="small-button"
                                type="submit"
                                onClick={() => onCameraButtonClicked()}>File
                            </button>
                        </div>
                    }
                    {!WEBCAM_EABLED &&
                        <div>
                            <button
                                className="small-button"
                                type="submit"
                                onClick={() => onCameraButtonClicked()}>Camera
                            </button>
                        </div>
                    }
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

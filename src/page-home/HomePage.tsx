import { useState, useEffect, FC } from "react";
import '../App.css';
import Modal from "react-modal";

import { LatLon } from "../api-myphotos/structure";
import { RecordForm } from "../components-common/RecordForm";
import { WebcamComp } from './WebcamComp';
import { PopUpMap } from '../components-common/PopUpMap';
import { PopUpMessage } from "../components-common/PopUpMessage";
import { apiPostRecord } from "../api-myphotos/myphotos";
import { apiGetAddressByLocation } from "../api-nominatim/nominatim";
import { FILE_INPUT_ENABLED, MOBILE_CAMERA_ENABLED, WEBCAM_EABLED } from "../util/constants";
import { MobileCameraComp } from "./MobileCameraComp";
import { FileInputComp } from "./FileInput";
//import { takePicture } from "../api-osc/osc";
//import { BlobToDataURI } from "../util/convert";

import NoSleep from 'NoSleep';

export const HomePage: FC = () => {

    const [latlon, setLatLon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [picLatlon, setPicLatlon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [address, setAddress] = useState<string>("");
    const [picAddress, setPicAddress] = useState<string>("");
    const [place, setPlace] = useState<string>(localStorage.getItem("place") || "");
    const [memo, setMemo] = useState<string>(localStorage.getItem("memo") || "");
    const [launchMobileCamera, setLaunchMobileCamera] = useState<boolean>(false);
    const [launchWebcam, setLaunchWebcam] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [showReject, setShowReject] = useState<boolean>(false);
    const [noSleep, setNoSleep] = useState<any>(null);

    Modal.setAppElement("#root");

    const onCameraButtonClicked = () => setLaunchMobileCamera(true);

    /*
    const onThetaButtonClicked = async () => {
        const blob = await takePicture();
        const imageURL = BlobToDataURI(blob);
        setPicLatlon(latlon);
        setPicAddress(address);
        setImageURL(imageURL);
    }
    */

    const clearInputFields = () => {
        setPlace("");
        setMemo("");
        setImageURL(null);
    }

    const onPicTaken = (imageURL: string | null) => {
        setPicLatlon(latlon);
        setPicAddress(address);
        if (imageURL) {
            setImageURL(imageURL);
        }
        setLaunchWebcam(false);
        setLaunchMobileCamera(false);
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
        const noSleep = new NoSleep();
        noSleep.enable();

        return () => {
            stopWatchingLocation();
            noSleep.disable();
        };
    }, []);

    /*** Upload a record ****************************************/
    const postRecord = async () => {
        if (imageURL) {
            setShowProgress(true);

            // Save parameters
            localStorage.setItem("place", place);
            localStorage.setItem("memo", memo);

            await apiPostRecord(place, memo, picLatlon, picAddress, imageURL);
            setShowProgress(false);
        } else {
            setShowReject(true);
            setTimeout(() => setShowReject(false), 2000);
        }
    }

    return (
        <>
            <MobileCameraComp launch={launchMobileCamera} onPicTaken={onPicTaken} />

            {!launchWebcam &&
                <>
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
                            {imageURL && <img id="img-temp" src={imageURL} width="35%" />}
                        </div>

                        {WEBCAM_EABLED &&
                            <div>
                                <button
                                    className="small-button"
                                    type="submit"
                                    onClick={() => setLaunchWebcam(true)}>WebCam
                                </button>
                            </div>
                        }

                        {MOBILE_CAMERA_ENABLED &&
                            <button
                                className="small-button"
                                type="submit"
                                onClick={() => onCameraButtonClicked()}>Camera
                            </button>
                        }

                        {FILE_INPUT_ENABLED && <FileInputComp onPicTaken={onPicTaken} />}

                        {/*
                        {THETA_ENABLED &&
                            <div>
                                <button
                                    className="small-button"
                                    type="submit"
                                    onClick={() => onThetaButtonClicked()}>Theta
                                </button>
                            </div>
                        }
                    */}
                    </div>

                    <div className="footer">
                        <button className="small-button" type="submit" onClick={() => setShowMap(true)}>Map</button>
                        <button className="small-button" type="submit" onClick={e => postRecord()}>Upload</button>
                        <button className="small-button" type="submit" onClick={clearInputFields}>Clear</button>
                    </div>
                </>
            }

            {launchWebcam && <WebcamComp onPicTaken={onPicTaken} />}

            {showMap && <PopUpMap onPopUpClosed={() => setShowMap(false)} latlon={latlon} />}

            {showProgress && <PopUpMessage message={'Uploading the record to the cloud...'} />}

            {showReject && <PopUpMessage isAlert={true} message={'Uploading rejected: no imaga data'} />}
        </>
    );
};

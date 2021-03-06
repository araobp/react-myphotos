import { useState, FC } from "react";
import '../App.css';
import Modal from "react-modal";

import { LatLon } from "../api-myphotos/structure";
import { RecordForm } from "../components-common/RecordForm";
import { WebcamComp } from './WebcamComp';
import { PopUpMap } from '../components-common/PopUpMap';
import { PopUpMessage } from "../components-common/PopUpMessage";
import { apiPostRecord } from "../api-myphotos/myphotos";
import { FILE_INPUT_ENABLED, LOGIN_NAME, MOBILE_CAMERA_ENABLED, WEBCAM_EABLED } from "../util/constants";
import { MobileCameraComp } from "./MobileCameraComp";
import { FileInputComp } from "./FileInputComp";
import { useGPS } from "../custom-hooks/GPS";

export const HomePage: FC = () => {

    const [picLatlon, setPicLatlon] = useState<LatLon>({ latitude: 0.0, longitude: 0.0 });
    const [picAddress, setPicAddress] = useState<string>("");
    const { latlon, address } = useGPS(true);
    const [place, setPlace] = useState<string>(localStorage.getItem("place") || "");
    const [memo, setMemo] = useState<string>(localStorage.getItem("memo") || "");
    const [launchMobileCamera, setLaunchMobileCamera] = useState<boolean>(false);
    const [launchWebcam, setLaunchWebcam] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [showReject, setShowReject] = useState<boolean>(false);

    Modal.setAppElement("#root");

    const onCameraButtonClicked = () => setLaunchMobileCamera(true);

    const clearInputFields = () => {
        setPlace("");
        setMemo("");
        setImageURL(null);
    }

    const onPicTaken = (imageURL: string | null) => {
        if (latlon == null) {
            setPicLatlon({ latitude: 0.0, longitude: 0.0 });
        } else {
            setPicLatlon(latlon);
        }
        if (address == null) {
            setPicAddress("<unknown>")
        } else {
            setPicAddress(address);
        }
        if (imageURL) {
            setImageURL(imageURL);
        }
        setLaunchWebcam(false);
        setLaunchMobileCamera(false);
    }

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

            <div id="navi-right">{LOGIN_NAME}</div>

            {!launchWebcam &&
                <>
                    <div className="default" style={{ padding: "1vw" }}>
                        {(latlon?.latitude !== 0) && (latlon?.longitude !== 0) &&
                            <>
                                <div className="latlon">Latitude: {latlon?.latitude.toFixed(6)}, Longitude: {latlon?.longitude.toFixed(6)}</div>
                                <div className="latlon">{address}</div>
                            </>
                            || <div className="latlon">Positioning...</div>
                        }

                        <hr />

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

                    </div>

                    <div className="footer">
                        <button className="small-button" type="submit" onClick={() => setShowMap(true)}>Map</button>
                        <button className="small-button" type="submit" onClick={e => postRecord()}>Upload</button>
                        <button className="small-button" type="submit" onClick={clearInputFields}>Clear</button>
                    </div>
                </>
            }

            {launchWebcam && <WebcamComp onPicTaken={onPicTaken} />}

            {latlon && showMap && <PopUpMap onPopUpClosed={() => setShowMap(false)} latlon={latlon} isHome={true} />}

            {showProgress && <PopUpMessage message={'Uploading the record to the cloud...'} />}

            {showReject && <PopUpMessage isAlert={true} message={'Uploading rejected: no imaga data'} />}
        </>
    );
};

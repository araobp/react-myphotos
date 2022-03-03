import { useState, FC } from "react";
import Modal from "react-modal";
import '../App.css';

// Camera
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { RESOLUTION } from "../util/constants";

type WebcamCompProps = {
    onPicTaken: (imageURL: string) => void;
}

// HTML5 camera component
export const WebcamComp: FC<WebcamCompProps> = ({ onPicTaken }) => {

    Modal.setAppElement('#root')

    const [temporaryDataURI, setTemporaryDataURI] = useState<string>("");
    const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);

    const handleTakePhoto = (imageURI: any) => {
        setTemporaryDataURI(imageURI);
        setImagePopUpIsOpen(true);
    }

    const done = () => {
        closeImagePopUp();
        onPicTaken(temporaryDataURI);
    }

    const cancel = () => {
        closeImagePopUp();
        setTemporaryDataURI("");
        onPicTaken("");
    }
    
    const closeImagePopUp = () => setImagePopUpIsOpen(false);

    return (
        <>
            {!imagePopUpIsOpen &&
                <div className="center-img">
                    <Camera isMaxResolution sizeFactor={RESOLUTION} onTakePhoto={(uri: any) => { handleTakePhoto(uri) }} imageType={IMAGE_TYPES.JPG}
                        idealFacingMode={FACING_MODES.ENVIRONMENT} isImageMirror={false} />
                </div>
            }
            
            <Modal isOpen={imagePopUpIsOpen} className="center-img">
                <div>
                    <img src={temporaryDataURI} style={{ width: "100vw", height: "80vh" }} />
                    <div className="row">
                        <button className="small-button" onClick={done} >Done</button>
                        <button className="small-button-retry" onClick={closeImagePopUp} >Retry</button>
                        <button className="small-button-cancel" onClick={cancel}>Cancel</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

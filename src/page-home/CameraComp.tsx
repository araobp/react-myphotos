import { useState, FC } from "react";
import Modal from "react-modal";
import '../App.css';

// Camera
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

type CameraCompProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    picTaken: (dataURI: string) => void;
}

export const CameraComp: FC<CameraCompProps> = ({ isOpen, setIsOpen, picTaken }) => {

    Modal.setAppElement('#root')

    const [temporaryDataURI, setTemporaryDataURI] = useState<string>("");
    const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);

    const handleTakePhoto = (imageURI: any) => {
        setTemporaryDataURI(imageURI);
        setImagePopUpIsOpen(true);
    }

    const done = () => {
        picTaken(temporaryDataURI);
        closeCameraComp();
    }

    const closeCameraComp = () => {
        setImagePopUpIsOpen(false);
        setIsOpen(false);
    }

    const closeImagePopUp = () => {
        setImagePopUpIsOpen(false);
    }

    return (
        <>
            {isOpen && !imagePopUpIsOpen &&
                <div className="center-img">
                    <Camera isMaxResolution sizeFactor={0.7} onTakePhoto={(uri: any) => { handleTakePhoto(uri) }} imageType={IMAGE_TYPES.JPG}
                        idealFacingMode={FACING_MODES.ENVIRONMENT} isImageMirror={false} />
                    <button className="small-button" onClick={closeCameraComp}>Close</button>
                </div>
            }
            
            <Modal isOpen={imagePopUpIsOpen} className="center-img">
                <div>
                    <img src={temporaryDataURI} style={{ width: "100vw", height: "80vh" }} />
                    <div className="row">
                        <button className="small-button" onClick={done} >Done</button>
                        <button className="small-button-cancel" onClick={closeImagePopUp} >Cancel</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

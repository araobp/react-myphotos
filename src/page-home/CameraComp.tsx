import { useState } from "react";
import Modal from "react-modal";
import '../App.css';

// Camera
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export const CameraComp = ({
    setDataURI,
    setShowCameraFlag
}: any) => {


    Modal.setAppElement('#root')

    const [temporaryDataURI, setTemporaryDataURI] = useState();
    const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);

    const handleTakePhoto = (imageURI: any) => {
        setTemporaryDataURI(imageURI);
        setImagePopUpIsOpen(true);
    }

    const done = () => {
        setDataURI(temporaryDataURI);
        closeCameraComp();
    }

    const closeCameraComp = () => {
        setImagePopUpIsOpen(false);
        setShowCameraFlag(false);
    }

    const closeImagePopUp = () => {
        setImagePopUpIsOpen(false);
    }

    return (
        <div>
            <Camera onTakePhoto={(uri: any) => { handleTakePhoto(uri) }} imageType={IMAGE_TYPES.JPG}
                idealFacingMode={FACING_MODES.ENVIRONMENT} isImageMirror={false} />
            <button className="small-button" onClick={closeCameraComp}>Close</button>
            <Modal isOpen={imagePopUpIsOpen} className="center-img">
                <div>
                    <img src={temporaryDataURI} style={{ width: "100vw", height: "80vh" }} />
                    <div className="row">
                        <button className="small-button" onClick={done} >Done</button>
                        <button className="small-button" onClick={closeImagePopUp} >Cancel</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

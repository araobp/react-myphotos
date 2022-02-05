import React, { useState } from "react";
import Modal from "react-modal";
import '../App.css';

// Camera
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
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
            <Camera onTakePhoto={(uri: any) => { handleTakePhoto(uri) }} imageType={IMAGE_TYPES.JPG} />
            <button className="small-button" onClick={closeCameraComp}>Close</button>
            <Modal isOpen={imagePopUpIsOpen} className="center">
                <div>
                    <img src={temporaryDataURI} />
                    <div className="row">
                        <button className="small-button" onClick={done}>Done</button>
                        <button className="small-button" onClick={closeImagePopUp}>Cancel</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

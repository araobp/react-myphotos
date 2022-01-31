import React, { useState } from "react";
import Modal from "react-modal";
import '../App.css';
import { styleModal } from '../components-common/styles';

// Camera
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export const CameraComp = ({ dataURI, setDataURI, setShowCameraFlag }) => {

    Modal.setAppElement('#root')

    const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);

    const handleTakePhoto = imageURI => {
        setDataURI(imageURI);
        setImagePopUpIsOpen(true);
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
            <Camera onTakePhoto={uri => { handleTakePhoto(uri) }} imageType={IMAGE_TYPES.JPG} />
            <Modal isOpen={imagePopUpIsOpen} style={styleModal}>
                <div>
                    <img className="contain" src={dataURI} onClick={() => closeImagePopUp()} />
                    <button onClick={closeCameraComp}>Use this image</button>
                </div>
            </Modal>
        </div>
    );
};

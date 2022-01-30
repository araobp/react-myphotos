import React, { useState } from "react";
import Modal from "react-modal";
import '../App.css';

// Camera
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export const CameraComp = ({dataURI, setDataURI, setShowCameraFlag}) => {

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

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    return (
        <div>
            <Camera onTakePhoto={uri => { handleTakePhoto(uri) }} />
            <Modal isOpen={imagePopUpIsOpen} style={customStyles}>
                <div>
                <img className="contain" src={dataURI} onClick={() => closeImagePopUp()} />
                <button onClick={closeCameraComp}>Use this image</button>
                </div>
            </Modal>
        </div>
    );
};

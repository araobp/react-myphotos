import React, { useState } from "react";
import Modal from "react-modal";
import '../App.css';

// Camera
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export const CameraComp = ({dataURL, setDataURL, setShowCameraFlag}) => {

    Modal.setAppElement('#root')

    const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);

    const handleTakePhoto = imageURL => {
        setDataURL(imageURL);
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
            <Camera onTakePhoto={imageURL => { handleTakePhoto(imageURL) }} />
            <Modal isOpen={imagePopUpIsOpen} style={customStyles}>
                <div>
                <img className="contain" src={dataURL} onClick={() => closeImagePopUp()} />
                <button onClick={closeCameraComp}>Use this image</button>
                </div>
            </Modal>
        </div>
    );
};

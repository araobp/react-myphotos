import React, { useState } from "react";
import Modal from "react-modal";
import '../App.css';

// Camera
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const CameraPage = ({ BASE_URL }) => {

    const [dataUrl, setDataUrl] = useState(null);
    const [imagePopUpIsOpen, setImagePopUpIsOpen] = useState(false);

    const handleTakePhoto = dataUri => {
        setDataUrl(dataUri);
        setImagePopUpIsOpen(true);
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
            <Camera onTakePhoto={dataUri => { handleTakePhoto(dataUri) }} />
            <Modal isOpen={imagePopUpIsOpen} style={customStyles}>
                <img className="contain" src={dataUrl} onClick={() => closeImagePopUp()} />
            </Modal>
        </div>
    );
};

export default CameraPage;
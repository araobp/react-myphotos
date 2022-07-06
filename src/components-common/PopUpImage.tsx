import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import { apiGetImage } from "../api-myphotos/myphotos";
import '../App.css';
import { PopUpMessage } from "./PopUpMessage";
import { modalBackgroundStyle } from "./styles";

export type PopUpImageProps = {
    onPopUpClosed: () => void;
    uuid: string
}

export const PopUpImage: FC<PopUpImageProps> = ({ onPopUpClosed, uuid}) => {

    const [imageURL, setImageURL] = useState<string>();
    const [showProgress, setShowProgress] = useState<boolean>(false);

    const getImage = (uuid: string) => {
        setShowProgress(true);
        apiGetImage(uuid)
            .then(objectURL => setImageURL(objectURL))
            .catch(e => console.log(e))
            .finally(() => setShowProgress(false));
    }

    const closePopUp = () => {
        onPopUpClosed();
    }

    useEffect(() => {
        setImageURL("");
        getImage(uuid);
    }, [uuid]);

    return (
        <>
            {showProgress && <PopUpMessage message="Downloading image..." /> } 
            <Modal isOpen={true} className="center-img" style={modalBackgroundStyle}>
                {imageURL && <img alt="pop up" src={imageURL} onClick={() => closePopUp()} style={{ width: "100vw", height: "100vh" }} />}
            </Modal>
        </>
    );
}
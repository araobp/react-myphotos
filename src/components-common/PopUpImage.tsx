import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import { apiGetImage } from "../api-myphotos/myphotos";
import '../App.css';
import { PopUpMessage } from "./PopUpMessage";
import { modalBackgroundStyle } from "./styles";

export type PopUpImageProps = {
    onPopUpClosed: () => void;
    id: number
}

export const PopUpImage: FC<PopUpImageProps> = ({ onPopUpClosed, id}) => {

    const [imageURL, setImageURL] = useState<string>();
    const [showProgress, setShowProgress] = useState<boolean>(false);

    const getImage = (id: number) => {
        setShowProgress(true);
        apiGetImage(id)
            .then(objectURL => setImageURL(objectURL))
            .catch(e => console.log(e))
            .finally(() => setShowProgress(false));
    }

    const closePopUp = () => {
        onPopUpClosed();
    }

    useEffect(() => {
        setImageURL("");
        getImage(id);
    }, [id]);

    return (
        <>
            {showProgress && <PopUpMessage message="Downloading image..." /> } 
            <Modal isOpen={true} className="center-img" style={modalBackgroundStyle}>
                {imageURL && <img src={imageURL} onClick={() => closePopUp()} style={{ width: "100vw", height: "100vh" }} />}
            </Modal>
        </>
    );
}
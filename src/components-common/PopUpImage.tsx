import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import { apiGetImage } from "../api/rest";
import '../App.css';

export type PopUpImageProps = {
    showImage: boolean;
    setShowImage: (state: boolean) => void;
    id: number
}

export const PopUpImage: FC<PopUpImageProps> = ({ showImage, setShowImage, id }) => {

    const [imageURL, setImageURL] = useState<string>("");

    const getImage = (id: number) => {
        apiGetImage(id)
            .then(objectURL => setImageURL(objectURL))
            .catch(e => console.log(e));
    }

    const closePopUp = () => {
        setShowImage(false);
    }

    useEffect(() => {
        setImageURL("");
        getImage(id);
    }, [id]);

    return (
        <>
            <Modal isOpen={showImage} className="center-img">
                <img src={imageURL} onClick={() => closePopUp()} style={{ width: "100vw", height: "100vh" }} />
            </Modal>
        </>
    );
}
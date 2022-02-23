import { useEffect, useState } from "react";
import Modal from "react-modal";
import { apiGetImage } from "../api/rest";
import '../App.css';

export type PopUpImageProps = {
    showImage: boolean;
    setShowImage: (state: boolean) => void;
    id: number
}

export const PopUpImage = ({ showImage, setShowImage, id }: PopUpImageProps) => {

    const [imageURL, setImageURL] = useState<string>("");

    const getImage = (id: number) => {
        apiGetImage(id, (success, objecURL) => {
            if (success) {
                setImageURL(objecURL);
            }
        });
    }

    const closePopUp = () => {
        setShowImage(false);
    }

    useEffect(() => {
        setImageURL("");
        getImage(id);
    }, [id]);

    return (
        <Modal isOpen={showImage} className="center-img">
            <img src={imageURL} onClick={() => closePopUp()} style={{ width: "100vw", height: "100vh" }} />
        </Modal>
    );
}
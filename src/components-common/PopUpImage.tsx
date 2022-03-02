import { FC, useEffect, useState } from "react";
import Modal from "react-modal";
import { apiGetImage } from "../api-myphotos/myphotos";
import '../App.css';

export type PopUpImageProps = {
    setShowImage: (state: boolean) => void;
    id: number
}

export const PopUpImage: FC<PopUpImageProps> = ({ setShowImage, id}) => {

    const [imageURL, setImageURL] = useState<string>();

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
            <Modal isOpen={true} className="center-img">
                {imageURL && <img src={imageURL} onClick={() => closePopUp()} style={{ width: "100vw", height: "100vh" }} />}
            </Modal>
        </>
    );
}
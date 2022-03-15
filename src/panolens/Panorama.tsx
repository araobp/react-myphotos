import * as PANOLENS from "panolens";
import { FC, useEffect, useState } from "react";
import { apiGetImage } from "../api-myphotos/myphotos";
import { PopUpMessage } from "../components-common/PopUpMessage";
import { PANORAMA_FOV } from "../util/constants";

export type PanoramaProps = {
    id: number;
}

// This function uses Panolens from https://pchen66.github.io/Panolens/
export const Panorama: FC<PanoramaProps> = ({ id }) => {

    const [showProgress, setShowProgress] = useState<boolean>(false);
    
    useEffect(() => {
        setShowProgress(true);

        apiGetImage(id)
        .then(imageURL => {
            const panorama = new PANOLENS.ImagePanorama(imageURL);
            const viewer = new PANOLENS.Viewer({
                container: document.querySelector("#panorama")
            });
            viewer.add(panorama);
            viewer.setCameraFov(PANORAMA_FOV);
        })
        .catch(e => console.log(e))
        .finally(() => setShowProgress(false));

    }, [id]);

    return (
        <>
            {showProgress && <PopUpMessage isAlert={false} message={'Downloading image...'} />}
            <div id="panorama" style={{color: "black", zIndex: 100}}/>
        </>
    );
}

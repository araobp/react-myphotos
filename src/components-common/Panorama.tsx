import * as PANOLENS from "panolens";
import { FC, useEffect } from "react";
import { apiGetImage } from "../api-myphotos/myphotos";


export type PanoramaProps = {
    id: number;
}

// This function uses Panolens from https://pchen66.github.io/Panolens/
export const Panorama: FC<PanoramaProps> = ({ id }) => {

    useEffect(() => {
        apiGetImage(id)
        .then(imageURL => {
            const panorama = new PANOLENS.ImagePanorama(imageURL);
            const viewer = new PANOLENS.Viewer({
                container: document.querySelector("#panorama")
            });
            viewer.add(panorama);    
        })
        .catch(e => console.log(e));
    }, [id]);

    return (
        <>
            <div id="panorama" />
        </>
    );
}

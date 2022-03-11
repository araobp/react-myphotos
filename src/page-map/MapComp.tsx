import { LatLngExpression } from "leaflet";
import { FC, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RecordResponse } from "../api-myphotos/structure";
import { PopUpImage } from "../components-common/PopUpImage";
import { useMap } from "react-leaflet";
import { DEFAULT_LOCATION } from "../util/constants";
import { PhotoFooter } from "../components-common/PhotoFooter";
import { apiGetPhotoAttribute } from "../api-myphotos/myphotos";
import { CloseFooter } from "../components-common/CloseFooter";
import { Panorama } from "../panolens/Panorama";
import { toLocalTime } from "../util/convert";

type MapCompProps = {
    records: Array<RecordResponse>;
    thumbnails: Map<string, string>;
    count: number;
    offset: number;
    setOffset: (offset: number) => void;
    zoom: number;
}

export const MapComp: FC<MapCompProps> = ({ records, thumbnails, count, offset, setOffset, zoom }) => {

    const [id, setId] = useState<number | null>(null);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [showPanorama, setShowPanorama] = useState<boolean>(false);
    const [currentCenter, setCurrentCenter] = useState<LatLngExpression | null>(null);

    const onThumbnailClick = (r: RecordResponse) => {
        setCurrentCenter([r.latitude, r.longitude]);
        openPhotoViewer(r.id);
    }

    const openPhotoViewer = (id: number) => {
        setId(id);
        apiGetPhotoAttribute(id)
            .then(photoAttribute => {
                console.log(photoAttribute);
                if (photoAttribute.equirectangular) {
                    setShowPanorama(true);
                } else {
                    setShowImage(true);
                }
            })
            .catch(e => {  // Note: in case a equirectangular value is not present in the row of the table
                setShowImage(true);
            });
    }


    const MapRefresh = () => {
        const map = useMap();
        if (currentCenter) {
            map.flyTo(currentCenter)
        } else if (records.length > 0) {
            map.flyTo([records[0].latitude, records[0].longitude]);
        }
        return null;
    }

    const onClosePanorama = () => {
        setShowPanorama(false);
    }

    return (
        <div style={{ overflow: "hidden" }}>
            {showImage && id && <PopUpImage onPopUpClosed={() => setShowImage(false)} id={id} />}
            {showPanorama && id && <Panorama id={id} />}

            {!showPanorama &&
                <MapContainer center={DEFAULT_LOCATION} zoom={zoom} scrollWheelZoom={true} tap={false} id="react-leaflet">
                    <MapRefresh />
                    <TileLayer
                        // attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                        // url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                        //-----------------
                        // Open Street Map
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {records.map((r, _) => (
                        <Marker key={r.id} position={[r.latitude, r.longitude]} >
                            <Popup minWidth={128}>
                                <div>
                                    [{r.place}]<br />
                                    {toLocalTime(r.timestamp)}<br />
                                    {r.memo}<br />
                                    <img src={thumbnails.get(`id_${r.id}`)} onClick={e => onThumbnailClick(r)} />
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            }

            {!showPanorama && <PhotoFooter count={count} offset={offset} setOffset={setOffset} />}
            {showPanorama && <CloseFooter onClose={onClosePanorama} />}
        </div>
    );
}

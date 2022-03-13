import { LatLngExpression } from "leaflet";
import { FC, useEffect, useState } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import { LatLon, RecordResponse } from "../api-myphotos/structure";
import { PopUpImage } from "../components-common/PopUpImage";
import { useMap } from "react-leaflet";
import { DEFAULT_LOCATION } from "../util/constants";
import { apiGetPhotoAttribute } from "../api-myphotos/myphotos";
import { Panorama } from "../panolens/Panorama";
import { toLocalTime } from "../util/convert";
import { greenIcon } from "../util-leaflet/icons";
import { Tiles } from "../util-leaflet/tiles";

type MapCompProps = {
    records: Array<RecordResponse>;
    thumbnails: Map<string, string>;
    zoom: number;
    latlon: LatLon | null;
}

export const MapComp: FC<MapCompProps> = ({ records, thumbnails, latlon, zoom }) => {

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
            setCurrentCenter(null);
        }
        return null;
    }

    useEffect(() => {
        if (records && records.length > 0) {
            setCurrentCenter([records[0].latitude, records[0].longitude]);
        }
    }, [records])

    return (
        <div style={{ overflow: "hidden" }}>
            {showImage && id && <PopUpImage onPopUpClosed={() => setShowImage(false)} id={id} />}
            {showPanorama && id && <Panorama id={id} />}

            {!showPanorama &&
                <MapContainer center={DEFAULT_LOCATION} zoom={zoom} scrollWheelZoom={true} tap={false} id="react-leaflet">
                    <MapRefresh />
                    <Tiles />
                    {records.map((r, _) => (
                        <Marker key={r.id} position={[r.latitude, r.longitude]} >
                            <Popup minWidth={128}>
                                <div>
                                    [{r.place}]<br />
                                    {toLocalTime(r.timestamp)}<br />
                                    {r.distance && <>{r.distance.toFixed(2)} km<br /></>}
                                    {r.memo}<br />
                                    <img src={thumbnails.get(`id_${r.id}`)} onClick={e => onThumbnailClick(r)} />
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    {latlon &&
                        <Marker position={[latlon.latitude, latlon.longitude]} icon={greenIcon} zIndexOffset={10}>
                            <Popup>
                                {latlon.latitude}, {latlon.longitude}
                            </Popup>
                        </Marker>
                    }
                </MapContainer>
            }
        </div>
    );
}

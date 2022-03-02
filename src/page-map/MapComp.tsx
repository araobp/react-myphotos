import { LatLngExpression } from "leaflet";
import { FC, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RecordResponse } from "../api-myphotos/structure";
import { PopUpImage } from "../components-common/PopUpImage";
import { useMap } from "react-leaflet";
import { DEFAULT_LOCATION } from "../util/constants";

type MapCompProps = {
    records: Array<RecordResponse>
    thumbnails: Map<string, string>
    zoom: number;
}

export const MapComp: FC<MapCompProps> = ({ records, thumbnails, zoom }) => {

    const [id, setId] = useState<number | null>(null);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [currentCenter, setCurrentCenter] = useState<LatLngExpression | null>(null);

    const onThumbnailClick = (r: RecordResponse) => {
        setCurrentCenter([r.latitude, r.longitude]);
        setId(r.id);
        setShowImage(true);
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

    return (
        <div style={{ overflow: "hidden" }}>
            {showImage && id && <PopUpImage setShowImage={setShowImage} id={id} />}

            <MapContainer center={DEFAULT_LOCATION} zoom={zoom} scrollWheelZoom={true} tap={false} id="react-leaflet">
                <MapRefresh />
                <TileLayer
                    //    attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                    //    url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                    //
                    // Open Street Map
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {records.map((r, _) => (
                    <Marker key={r.id} position={[r.latitude, r.longitude]} >
                        <Popup minWidth={128}>
                            <div>
                                [{r.place}]<br />
                                {r.memo}<br />
                                <img src={thumbnails.get(`id_${r.id}`)} onClick={e => onThumbnailClick(r)} />
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

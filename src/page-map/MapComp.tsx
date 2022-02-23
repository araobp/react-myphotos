import { LatLngExpression } from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RecordResponse } from "../api/structure";
import { PopUpImage } from "../components-common/PopUpImage";

type MapCompProps = {
    records: Array<RecordResponse>
    thumbnails: Map<string, string>
    center: LatLngExpression;
    zoom: number;
}

export const MapComp = ({ records, thumbnails, center, zoom }: MapCompProps) => {

    const [id, setId] = useState<number|null>(null);
    const [showImage, setShowImage] = useState<boolean>(false);

    const onThumbnailClick = (id: number) => {
        setId(id);
        setShowImage(true);
    }

    return (
        <div style={{ overflow: "hidden" }}>
            {id && <PopUpImage showImage={showImage} setShowImage={setShowImage} id={id}></PopUpImage>}

            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} id="map-height">
                <TileLayer
                    attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                    url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                // Open Street Map
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {records.map((r, _) => (
                    <Marker position={[r.latitude, r.longitude]}>
                        <Popup>
                            <div>
                                [{r.place}]<br />
                                {r.memo}<br />
                                <img src={thumbnails.get(`id_${r.id}`)} onClick={e => onThumbnailClick(r.id)} />
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

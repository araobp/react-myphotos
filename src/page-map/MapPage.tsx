import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import '../App.css';

import { RecordResponse, Thumbnails } from "../api/structure";

import { apiGetRecords, apiGetRecordsCallback } from "../api/rest";

const position: LatLngExpression = [51.505, -0.09];

export const MapPage = () => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Thumbnails>({});

    const backward = () => {

    }

    const forward = () => {

    }

    useEffect(() => {
        apiGetRecords(10, 0, (err, rec) => {
            setRecords(rec);
            console.log(rec);
        });
    }, []);

    return (
        <>
            <div style={{ overflow: "hidden" }}>
                <MapContainer center={position} zoom={15} scrollWheelZoom={true} id="map-height">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => backward()}>&lt;</button>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => forward()}>&gt;</button>
            </div>
        </>
    )
}
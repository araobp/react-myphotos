import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { GpsLogResponse } from "../api/structure";
import { useMap } from "react-leaflet";
import { FC, useState } from "react";

import { toLocalTime } from "../util/convert";
import { DEFAULT_LOCATION } from "../util/constants";

type LogCompProps = {
    gpsLogs: Array<GpsLogResponse>
    zoom: number;
}

export const LogComp: FC<LogCompProps> = ({ gpsLogs, zoom }) => {

    const MapRefresh = () => {
        const map = useMap();
        if (gpsLogs.length > 0) {
            map.flyTo([gpsLogs[0].latitude, gpsLogs[0].longitude]);
        }
        return null;
    }

    return (
        <div style={{ overflow: "hidden" }}>
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
                {gpsLogs.map((l, _) => (
                    <Marker key={l.id} position={[l.latitude, l.longitude]}>
                        <Popup>
                            <div>
                                {toLocalTime(l.datetime)}
                            </div>
                        </Popup>
                    </Marker>
                ))}
                <div>Date:</div>
            </MapContainer>
        </div>
    );
}

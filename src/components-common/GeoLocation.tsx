import React, { FunctionComponent, useState } from "react";
//import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import { LatLon } from "./structure";

export const GeoLocation: FunctionComponent<LatLon> = ({ latitude, longitude }: LatLon) => {

    latitude = (latitude) ? latitude : 0.0;
    longitude = (longitude) ? longitude : 0.0;

    console.log(latitude);
    console.log(longitude);

    return (
        <div>
            <MapContainer center={[latitude, longitude]} zoom={17} scrollWheelZoom={false} style={{ width: "70vw", height: "70vh"}}>
                <TileLayer
                    //    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}


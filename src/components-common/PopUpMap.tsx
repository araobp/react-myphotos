import { FunctionComponent } from "react";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
//import "leaflet/dist/leaflet.css";

import { LatLon } from "./structure";

/*
export const GeoLocation: FunctionComponent<LatLon> = ({ latitude, longitude }: LatLon) => {

    latitude = (latitude) ? latitude : 0.0;
    longitude = (longitude) ? longitude : 0.0;

    console.log(latitude);
    console.log(longitude);

    return (
        <>
            <MapContainer center={[latitude, longitude]} zoom={17} scrollWheelZoom={false} style={{
                width: "70vw", height: "70vh",
                outline: "#888888 solid 3px"
            }}>
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
        </>
    );
}
*/

export type PopUpMapProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    latlon: LatLon;
}

export const PopUpMap: FunctionComponent<PopUpMapProps> = ({ isOpen, setIsOpen, latlon }: PopUpMapProps) => {
    return (
        <>
            <Modal isOpen={isOpen} className="center">
                <div>
                    {/*<GeoLocation latitude={latlon.latitude} longitude={latlon.longitude} />*/}

                    <MapContainer center={[latlon.latitude, latlon.longitude]} zoom={17} scrollWheelZoom={false} style={{
                        width: "70vw", height: "70vh",
                        outline: "#888888 solid 3px"
                    }}>
                        <TileLayer
                            //    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[latlon.latitude, latlon.longitude]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>

                    <button className="small-button" onClick={() => setIsOpen(false)}>Close</button>
                </div>
            </Modal>
        </>
    );
}

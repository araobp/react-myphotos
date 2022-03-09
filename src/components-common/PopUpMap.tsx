import { FC } from "react";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
//import "leaflet/dist/leaflet.css";

import { LatLon } from "../api-myphotos/structure";
import { modalBackgroundStyle, modalMapStyle } from "./styles";

export type PopUpMapProps = {
    onPopUpClosed: () => void;
    latlon: LatLon;
}

export const PopUpMap: FC<PopUpMapProps> = ({ onPopUpClosed, latlon }) => {
    return (
        <div style={{color: "black"}}>
            <Modal isOpen={true} className="center" style={modalMapStyle}>
                <div>
                    <MapContainer center={[latlon.latitude, latlon.longitude]} zoom={16} scrollWheelZoom={true} style={{
                        width: "80vw", height: "80vh"
                    }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[latlon.latitude, latlon.longitude]}>
                            <Popup>
                                {latlon.latitude}, {latlon.longitude}
                            </Popup>
                        </Marker>
                    </MapContainer>

                    <button className="small-button" onClick={e => onPopUpClosed()}>Close</button>
                </div>
            </Modal>
        </div>
    );
}

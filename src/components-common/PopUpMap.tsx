import { FC } from "react";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
//import "leaflet/dist/leaflet.css";

import { LatLon } from "../api-myphotos/structure";
import { modalMapStyle } from "./styles";
import { greenIcon } from "../util-leaflet/icons";
import { Tiles } from "../util-leaflet/tiles";

export type PopUpMapProps = {
    onPopUpClosed: () => void;
    latlon: LatLon;
    isHome?: boolean;
}

export const PopUpMap: FC<PopUpMapProps> = ({ onPopUpClosed, latlon, isHome = false }) => {

    return (
        <div style={{ color: "black" }}>
            <Modal isOpen={true} className="center" style={modalMapStyle}>
                <div>
                    <MapContainer center={[latlon.latitude, latlon.longitude]} zoom={16} scrollWheelZoom={true} style={{
                        width: "80vw", height: "80vh"
                    }}>
                        <Tiles />
                        {isHome &&
                            <Marker position={[latlon.latitude, latlon.longitude]} icon={greenIcon} >
                                <Popup>
                                    {latlon.latitude}, {latlon.longitude}
                                </Popup>
                            </Marker>
                        }
                        {!isHome &&
                            <Marker position={[latlon.latitude, latlon.longitude]} >
                                <Popup>
                                    {latlon.latitude}, {latlon.longitude}
                                </Popup>
                            </Marker>
                        }
                    </MapContainer>

                    <button className="small-button" onClick={e => onPopUpClosed()}>Close</button>
                </div>
            </Modal>
        </div>
    );
}

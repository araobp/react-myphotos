import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import '../App.css';

const position: LatLngExpression = [51.505, -0.09];

export const MapPage = () => {
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
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit">&lt;</button>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit">&gt;</button>
            </div>
        </>
    )
}
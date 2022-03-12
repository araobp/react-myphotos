import { LayersControl, TileLayer } from "react-leaflet";

export const Tiles = () => {

    return (
        <>
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="国土地理院 標準地図">
                    <TileLayer
                        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                        url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="国土地理院 写真">
                    <TileLayer
                        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                        url="https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="国土地理院 色別標高図">
                    <TileLayer
                        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                        url="https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>

            </LayersControl>
        </>
    );
}



import { LatLng, LatLngBounds, LatLngExpression } from "leaflet";
import { FC, useEffect, useState } from "react";
import { icon } from "leaflet";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { LatLon, RecordResponse } from "../api-myphotos/structure";
import { DEFAULT_LOCATION } from "../util/constants";
import { toLocalTime } from "../util/convert";
import { Tiles } from "../util-leaflet/tiles";

type MapCompProps = {
    records: Array<RecordResponse>;
    thumbnails: Map<string, string>;
    zoom: number;
    latlon: LatLon | null;
    openPhotoViewer: (id: number) => void;
}

const centerIcon = icon({
    iconUrl: require("./center.png"),
    iconSize: [24, 24]
});

export const MapComp: FC<MapCompProps> = ({ records, thumbnails, latlon, zoom, openPhotoViewer }) => {

    const [currentCenter, setCurrentCenter] = useState<LatLngExpression | null>(null);

    const onThumbnailClick = (r: RecordResponse) => {
        setCurrentCenter([r.latitude, r.longitude]);
        openPhotoViewer(r.id);
    }

    const MapRefresh = () => {
        const map = useMap();
        if (currentCenter == null) {
            const bounds = findBounds();
            map.fitBounds(bounds);
        } else {
            map.flyTo(currentCenter)
        }
        return null;
    }

    const findBounds = () => {
        let swLat = 90;
        let swLon = 180;
        let neLat = -90;
        let neLon = -180;

        records.forEach(r => {
            const lat = r.latitude;
            const lon = r.longitude;
            if (lat > neLat) neLat = lat;
            if (lon > neLon) neLon = lon;
            if (lat < swLat) swLat = lat;
            if (lon < swLon) swLon = lon;
        });

        return new LatLngBounds(new LatLng(swLat, swLon), new LatLng(neLat, neLon));
    }

    useEffect(() => {
        setCurrentCenter(null);
    }, [records])

    return (
        <div style={{ overflow: "hidden" }}>
            <MapContainer center={DEFAULT_LOCATION} zoom={zoom} scrollWheelZoom={true} tap={false} id="react-leaflet">
                <MapRefresh />
                <Tiles />
                {records.map((r, _) => (
                    <Marker key={r.id} position={[r.latitude, r.longitude]} >
                        <Popup minWidth={128}>
                            <div>
                                [{r.place}]<br />
                                {toLocalTime(r.timestamp)}<br />
                                {r.distance && <>{r.distance.toFixed(2)} km<br /></>}
                                {r.memo}<br />
                                <img src={thumbnails.get(`id_${r.id}`)} onClick={e => onThumbnailClick(r)} />
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {latlon &&
                    <Marker position={[latlon.latitude, latlon.longitude]} icon={centerIcon} zIndexOffset={50}>
                        <Popup>
                            {latlon.latitude}, {latlon.longitude}
                        </Popup>
                    </Marker>
                }
            </MapContainer>
        </div>
    );
}

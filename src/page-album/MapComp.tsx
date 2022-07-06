import { LatLng, LatLngBounds, LatLngExpression } from "leaflet";
import { FC, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { LatLon, RecordResponse } from "../api-myphotos/structure";
import { DEFAULT_LOCATION } from "../util/constants";
import { toLocalTime } from "../util/convert";
import { Tiles } from "../util-leaflet/tiles";
import { centerIcon } from "../util-leaflet/icons";

type MapCompProps = {
    records: Array<RecordResponse>;
    thumbnails: Map<string, string>;
    zoom: number;
    latlon: LatLon | null;
    openPhotoViewer: (uuid: string) => void;
}

export const MapComp: FC<MapCompProps> = ({ records, thumbnails, latlon, zoom, openPhotoViewer }) => {

    const [currentCenter, setCurrentCenter] = useState<LatLngExpression | null>(null);

    const onThumbnailClick = (r: RecordResponse) => {
        setCurrentCenter([r.geolocation__latitude__s, r.geolocation__longitude__s]);
        openPhotoViewer(r.uuid);
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
            const lat = r.geolocation__latitude__s;
            const lon = r.geolocation__longitude__s;
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
                    <Marker key={r.uuid} position={[r.geolocation__latitude__s, r.geolocation__longitude__s]} >
                        <Popup minWidth={128}>
                            <div>
                                [{r.name}]<br />
                                {toLocalTime(r.timestamp__c)}<br />
                                {r.distance && <>{r.distance.toFixed(2)} km<br /></>}
                                {r.memo__c}<br />
                                <img alt="thumbnail" src={thumbnails.get(`uuid_${r.uuid}`)} onClick={e => onThumbnailClick(r)} />
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {latlon &&
                    <Marker position={[latlon.latitude, latlon.longitude]} icon={centerIcon} zIndexOffset={128}>
                        <Popup>
                            {latlon.latitude}, {latlon.longitude}
                        </Popup>
                    </Marker>
                }
            </MapContainer>
        </div>
    );
}

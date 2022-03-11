import { useEffect, useState } from "react";
import { LatLon } from "../api-myphotos/structure";
import { apiGetAddressByLocation } from "../api-nominatim/nominatim";

export const useGPS = (enabled: boolean) => {

    const [latlon, setLatLon] = useState<LatLon | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isWatching, setIsWatching] = useState<boolean>(false);
    const [watchId, setWatchId] = useState<number | null>(null);

    const startWatchingLocation = () => {
        const id = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            setLatLon({ latitude, longitude });
            lookUpAddressByLocation(latitude, longitude);
            if (!isWatching) setIsWatching(true);
        },
            () => { console.log('Watching geolocation failed') },
            {
                enableHighAccuracy: true
            }
        );
        setWatchId(id);
    };

    const stopWatchingLocation = () => {
        watchId && navigator.geolocation.clearWatch(watchId);
        setIsWatching(false);
    };

    const lookUpAddressByLocation = (latitude: number, longitude: number) => {
        apiGetAddressByLocation(latitude, longitude)
            .then(address => setAddress(address))
            .catch(e => console.log(e));
    }

    useEffect(() => {
        if (enabled) {
            if ('geolocation' in navigator) {
                startWatchingLocation();
            }
            return () => {
                stopWatchingLocation();
            };
        }
    }, []);

    return { latlon, address, isWatching };
}
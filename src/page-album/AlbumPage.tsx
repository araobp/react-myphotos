import { useState, useEffect, FC } from "react";

import { RecordResponse } from "../api-myphotos/structure";
import { PopUpImage } from "../components-common/PopUpImage";
import { LIMIT } from "../util/constants";
import { apiGetRecords, apiGetThumbnails, apiGetRecordCount, apiGetPhotoAttribute, apiGetRecordsOrderByDistance } from "../api-myphotos/myphotos";
import { AlbumFooter } from "./AlbumFooter";
import { Panorama } from "../panolens/Panorama";
import { CloseFooter } from "../components-common/CloseFooter";
import { useGPS } from "../custom-hooks/GPS";
import { BiCard, BiMapAlt, BiBullseye, BiSortDown } from "react-icons/bi";
import { CardsComp } from "./CardsComp";
import { MapComp } from "./MapComp";
import { PopUpMessage } from "../components-common/PopUpMessage";

export const AlbumPage: FC = () => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [showImage, setShowImage] = useState<boolean>(false);
    const [showPanorama, setShowPanorama] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const [mapMode, setMapMode] = useState<boolean>(false);
    const [gpsEnabled, setGpsEnabled] = useState<boolean>(false);  // GPS is disabled at first
    const [closestOrder, setClosestOrder] = useState<boolean>(false);

    const { latlon, isWatching } = useGPS(gpsEnabled);

    const [showProgress, setShowProgress] = useState<boolean>(false);

    const openPhotoViewer = (id: number) => {
        setId(id);
        apiGetPhotoAttribute(id)
            .then(photoAttribute => {
                if (photoAttribute.equirectangular) {
                    setShowPanorama(true);
                } else {
                    setShowImage(true);
                }
            })
            .catch(e => {  // Note: in case a equirectangular value is not present in the row of the table
                setShowImage(true);
            });
    }

    const updateRecordTable = () => {
        setShowProgress(true);
        apiGetRecordCount()
            .then(cnt => {
                setCount(cnt);
                if (closestOrder && latlon) {
                    return apiGetRecordsOrderByDistance(latlon.latitude, latlon.longitude, LIMIT, offset)
                } else {
                    return apiGetRecords(LIMIT, offset)
                }
            })
            .then(r => {
                setRecords(r);
                return apiGetThumbnails(r);
            })
            .then(t => setThumbnails(t))
            .catch(e => console.trace(e))
            .finally(()=>setShowProgress(false));
    }

    const onClosePanorama = () => setShowPanorama(false);

    // Initialization
    useEffect(() => {
        if (closestOrder) {
            setGpsEnabled(true);
        }
        else {
            updateRecordTable();
        }
    }, []);

    useEffect(() => {
        if (closestOrder) {
            setGpsEnabled(true);
        } else {
            updateRecordTable();
        }
    }, [offset]);

    // GPS is disabled shortly after having fetched the first latlon data from GPS
    useEffect(() => {
        updateRecordTable();
        setGpsEnabled(false);
    }, [isWatching]);

    useEffect(() => {
        if (closestOrder) {
            setGpsEnabled(true);
        } else {
            updateRecordTable();
        }
    }, [closestOrder]);

    const toggleView = () => setMapMode(m => !m);

    const toggleClosestOrder = () => {
        setClosestOrder(o => {
            if (!o) setGpsEnabled(true);
            return !o
        });
    }

    return (
        <>
            {showProgress && <PopUpMessage message="Downloading records..."/> }

            <div
                id="navi-right"
                onClick={toggleView}
                style={{ fontSize: "2.2rem", top: "0.6rem" }}>
                {!closestOrder && <BiCard />}
                {closestOrder && <BiMapAlt />}
            </div>
            <div
                id="navi-right2"
                onClick={toggleClosestOrder}
                style={{ fontSize: "2.2rem", top: "0.6rem" }}>
                {!closestOrder && <BiSortDown />}
                {closestOrder && <BiBullseye />}
            </div>

            {showImage && id && <PopUpImage onPopUpClosed={() => setShowImage(false)} id={id} />}
            {showPanorama && id && <Panorama id={id} />}

            {!mapMode &&
                <CardsComp
                    records={records}
                    thumbnails={thumbnails}
                    updateRecordTable={updateRecordTable}
                    openPhotoViewer={id => openPhotoViewer(id)}
                />
            }
            {mapMode &&
                <MapComp
                    records={records}
                    thumbnails={thumbnails}
                    latlon={latlon}
                    zoom={11}
                    openPhotoViewer={id => openPhotoViewer(id)}
                />
            }

            {!showPanorama && <AlbumFooter latlon={latlon} closestOrder={closestOrder} isWatching={isWatching} count={count} offset={offset} setOffset={setOffset} />}
            {showPanorama && <CloseFooter onClose={onClosePanorama} />}
        </>
    );
}

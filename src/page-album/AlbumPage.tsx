import { useState, useEffect, FC } from "react";

import { RecordResponse } from "../api-myphotos/structure";
import { PopUpImage } from "../components-common/PopUpImage";
import { LIMIT, ORDER_BY_DISTANCE } from "../util/constants";
import { apiGetRecords, apiGetThumbnails, apiGetRecordCount, apiGetPhotoAttribute, apiGetRecordsOrderByDistance } from "../api-myphotos/myphotos";
import { PhotoFooter } from "../components-common/PhotoFooter";
import { Panorama } from "../panolens/Panorama";
import { CloseFooter } from "../components-common/CloseFooter";
import { useGPS } from "../custom-hooks/GPS";
import { BiCard, BiMapAlt, BiBullseye, BiSortDown } from "react-icons/bi";
import { CardsComp } from "./CardsComp";
import { MapComp } from "./MapComp";

export const AlbumPage: FC = () => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [showImage, setShowImage] = useState<boolean>(false);
    const [showPanorama, setShowPanorama] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const [mapMode, setMapMode] = useState<boolean>(false);
    const [orderByDistance, setOrderByDistance] = useState<boolean>(ORDER_BY_DISTANCE);

    const { latlon, isWatching } = useGPS(orderByDistance);

    const openPhotoViewer = (id: number) => {
        setId(id);
        apiGetPhotoAttribute(id)
            .then(photoAttribute => {
                console.log(photoAttribute);
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
        apiGetRecordCount()
            .then(cnt => {
                setCount(cnt);
                if (latlon == null) {
                    return apiGetRecords(LIMIT, offset)
                } else {
                    return apiGetRecordsOrderByDistance(latlon.latitude, latlon.longitude, LIMIT, offset)
                }
            })
            .then(r => {
                setRecords(r);
                return apiGetThumbnails(r);
            })
            .then(t => setThumbnails(t))
            .catch(e => console.trace(e));
    }

    const onClosePanorama = () => setShowPanorama(false);

    // Initialization
    useEffect(() => {
        if (!orderByDistance) {
            updateRecordTable();
        }
    }, []);

    useEffect(() => {
            updateRecordTable();
    }, [isWatching]);

    useEffect(() => {
        if (!orderByDistance || (orderByDistance && isWatching))
            updateRecordTable();
    }, [offset]);

    const toggleView = () => setMapMode(m => !m);

    const toggleOrderByDistance = () => setOrderByDistance(o => !o);

    return (
        <>
            <div
                id="navi-right"
                onClick={toggleView}
                style={{ fontSize: "2.2rem", top: "0.6rem" }}>
                {!mapMode && <BiCard />}
                {mapMode && <BiMapAlt />}
            </div>
            <div
                id="navi-right2"
                onClick={toggleOrderByDistance}
                style={{ fontSize: "2.2rem", top: "0.6rem" }}>
                {!orderByDistance && <BiSortDown />}
                {orderByDistance && <BiBullseye />}
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
                />
            }

            {!showPanorama && <PhotoFooter latlon={latlon} count={count} offset={offset} setOffset={setOffset} />}
            {showPanorama && <CloseFooter onClose={onClosePanorama} />}
        </>
    );
}

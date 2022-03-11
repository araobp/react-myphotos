import { FC, useEffect, useState } from "react";
import '../App.css';

import { RecordResponse } from "../api-myphotos/structure";
import { apiGetRecords, apiGetThumbnails, apiGetRecordCount, apiGetRecordsOrderByDistance } from "../api-myphotos/myphotos";
import { LIMIT, ORDER_BY_DISTANCE } from "../util/constants";
import { MapComp } from "./MapComp";
import { useGPS } from "../hooks-common/GPS";

export const MapPage: FC<{}> = _ => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const { latlon, isWatching } = useGPS(ORDER_BY_DISTANCE);

    const updateRecordTable = () => {
        apiGetRecordCount()
            .then(cnt => {
                setCount(cnt);
                if (latlon == null) {
                    return apiGetRecords(LIMIT, offset);
                } else {
                    return apiGetRecordsOrderByDistance(latlon.latitude, latlon.longitude, LIMIT, offset);
                }
            })
            .then(r => {
                if (r.length > 0) {
                    setRecords(r);
                    apiGetThumbnails(r)
                        .then(t => setThumbnails(t));
                }
            })
            .catch(e => console.trace(e));
    }


    // Initialization
    useEffect(() => {
        if (!ORDER_BY_DISTANCE) {
            updateRecordTable();
        }
    }, []);

    useEffect(() => {
        if (isWatching) {
            updateRecordTable();
        }
    }, [isWatching]);

    useEffect(() => {
        if (!ORDER_BY_DISTANCE || (ORDER_BY_DISTANCE && isWatching))
            updateRecordTable();
    }, [offset]);

    return (
        <>
            <MapComp records={records} thumbnails={thumbnails} latlon={latlon} count={count} offset={offset} setOffset={setOffset} zoom={11} />
        </>
    )
}
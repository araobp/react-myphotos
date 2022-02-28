import { FC, useEffect, useState } from "react";
import '../App.css';

import { RecordResponse } from "../api/structure";
import { apiGetRecords, apiGetThumbnails, apiGetRecordCount } from "../api/rest";
import { LIMIT } from "../util/manipulation";
import { LatLngExpression } from "leaflet";
import { MapComp } from "./MapComp";
import { DEFAULT_LOCATION } from "../util/constants";
import { PhotoFooter } from "../components-common/PhotoFooter";

export const MapPage: FC<{}> = _ => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [center, setCenter] = useState<LatLngExpression>(DEFAULT_LOCATION);
    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const updateRecordTable = () => {
        apiGetRecordCount()
        .then(cnt => {
            setCount(cnt);
            return apiGetRecords(LIMIT, offset);
        })
        .then(r => {
            if (r.length > 0) {
                setRecords(r);
                apiGetThumbnails(r)
                .then(t => setThumbnails(t));
                setCenter([r[0].latitude, r[0].longitude]);
            }
        })
        .catch(e => console.trace(e));
    }

    // Initialization
    useEffect(() => {
        updateRecordTable();
    }, []);

    useEffect(() => {
        updateRecordTable();
    }, [offset]);

    return (
        <>
            <MapComp records={records} thumbnails={thumbnails} center={center} zoom={11} />
            <PhotoFooter count={count} offset={offset} setOffset={setOffset} />
        </>
    )
}
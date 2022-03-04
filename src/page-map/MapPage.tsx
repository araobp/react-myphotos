import { FC, useEffect, useState } from "react";
import '../App.css';

import { RecordResponse } from "../api-myphotos/structure";
import { apiGetRecords, apiGetThumbnails, apiGetRecordCount } from "../api-myphotos/myphotos";
import { LIMIT } from "../util/manipulation";
import { MapComp } from "./MapComp";

export const MapPage: FC<{}> = _ => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
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
            <MapComp records={records} thumbnails={thumbnails} count={count} offset={offset} setOffset={setOffset} zoom={11} />
        </>
    )
}
import { useEffect, useState } from "react";
import '../App.css';

import { RecordResponse } from "../api/structure";
import { apiGetRecords, apiGetThumbnails, apiGetCount } from "../api/rest";
import { forward, backward, LIMIT } from "../util/manipulation";
import L, { LatLngExpression } from "leaflet";
import { MapComp } from "./MapComp";
import { DEFAULT_LOCATION } from "../util/constants";

export const MapPage = () => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [center, setCenter] = useState<LatLngExpression>(DEFAULT_LOCATION);
    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const updateRecordTable = () => {
        apiGetCount()
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
            <MapComp records={records} thumbnails={thumbnails} center={center} zoom={10} />
            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(backward(offset))}>&lt;</button>
                <div style={{ fontSize: "1.3rem" }}>{offset + 1}/{count}</div>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset, count))}>&gt;</button>
            </div>
        </>
    )
}
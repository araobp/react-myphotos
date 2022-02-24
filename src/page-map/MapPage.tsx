import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import '../App.css';

import { RecordResponse } from "../api/structure";
import { apiGetRecords, apiGetThumbnails, apiGetCount } from "../api/rest";
import { forward, backward, LIMIT } from "../util/manipulation";
import { LatLngExpression } from "leaflet";
import { MapComp } from "./MapComp";

const defaultLocation: LatLngExpression = [35.68124505309657, 139.76713985772236];  // Tokyo station

export const MapPage = () => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [center, setCenter] = useState<LatLngExpression>(defaultLocation);
    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const updateRecordTable = async () => {
        const result0 = await apiGetCount();
        if (result0.success) {
            setCount(result0.data);
            const result1 = await apiGetRecords(LIMIT, offset);
            if (result1.success) {
                const records = result1.data;
                setRecords(records);
                if (records.length > 0) {
                    setCenter([records[0].latitude, records[0].longitude]);
                    const result2 = await apiGetThumbnails(records);
                    if (result2.success) {
                        const thumbnails = result2.data;
                        setThumbnails(thumbnails);
                    }
                }
            }
        }
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
            <MapComp records={records} thumbnails={thumbnails} center={defaultLocation} zoom={10} />
            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(backward(offset))}>&lt;</button>
                <div style={{ fontSize: "1.3rem" }}>{offset+1}/{count}</div>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset, count))}>&gt;</button>
            </div>
        </>
    )
}
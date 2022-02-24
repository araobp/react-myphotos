import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import '../App.css';

import { RecordResponse } from "../api/structure";
import { apiGetRecords, apiGetThumbnails } from "../api/rest";
import { forward, backward, LIMIT } from "../util/manipulation";
import { LatLngExpression } from "leaflet";
import { MapComp } from "./MapComp";

const defaultLocation: LatLngExpression = [35.68124505309657, 139.76713985772236];  // Tokyo station

export const MapPage = () => {

    const [records, setRecords] = useState<Array<RecordResponse>>([]);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map<string, string>());
    const [center, setCenter] = useState<LatLngExpression>(defaultLocation);
    const [offset, setOffset] = useState<number>(0);

    const updateRecordTable = async () => {
        const result = await apiGetRecords(LIMIT, offset);
        if (result.success) {
            const records = result.data;
            setRecords(records);
            if (records.length > 0) {
                setCenter([records[0].latitude, records[0].longitude]);
                const result = await apiGetThumbnails(records);
                if (result.success) {
                    const thumbnails = result.data;
                    setThumbnails(thumbnails);
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
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset))}>&gt;</button>
            </div>
        </>
    )
}
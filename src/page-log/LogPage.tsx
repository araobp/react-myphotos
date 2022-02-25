import { useEffect, useState } from "react";
import '../App.css';

import { GpsLogResponse } from "../api/structure";
import { apiGetGpsLogs, apiGetGpsLogCount } from "../api/rest";
import { forward, backward, LIMIT } from "../util/manipulation";
import { LatLngExpression } from "leaflet";
import { LogComp } from "./LogComp";
import { DEFAULT_LOCATION } from "../util/constants";

export const LogPage = () => {

    const [gpsLogs, setGpsLogs] = useState<Array<GpsLogResponse>>([]);
    const [center, setCenter] = useState<LatLngExpression>(DEFAULT_LOCATION);
    const [offset, setOffset] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    const updateGpsLogTable = () => {
        apiGetGpsLogCount()
        .then(cnt => {
            setCount(cnt);
            return apiGetGpsLogs(LIMIT, offset);
        })
        .then(l => {
            if (l.length > 0) {
                setGpsLogs(l);
                setCenter([l[0].latitude, l[0].longitude]);
            }
        })
        .catch(e => console.trace(e));
    }

    // Initialization
    useEffect(() => {
        updateGpsLogTable();
    }, []);

    useEffect(() => {
        updateGpsLogTable();
    }, [offset]);

    return (
        <>
            <LogComp gpsLogs={gpsLogs} center={center} zoom={12} />
            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(backward(offset))}>&lt;</button>
                <div style={{ fontSize: "1.3rem" }}>{offset + 1}/{count}</div>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset, count))}>&gt;</button>
            </div>
        </>
    )
}
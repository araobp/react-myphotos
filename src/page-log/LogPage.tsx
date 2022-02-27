import { FC, useEffect, useState } from "react";
import '../App.css';

import { GpsLogResponse } from "../api/structure";
import { apiGetGpsLogCount, FetchDirection, apiGetSession } from "../api/rest";
import { LatLngExpression } from "leaflet";
import { LogComp } from "./LogComp";
import { DEFAULT_LOCATION, POSTGRES_MAX_INTEGER_VALUE } from "../util/constants";

export const LogPage: FC<{}> = _ => {

    const [gpsLogs, setGpsLogs] = useState<Array<GpsLogResponse>>([]);
    const [center, setCenter] = useState<LatLngExpression>(DEFAULT_LOCATION);
    const [current, setCurrent] = useState<number>(POSTGRES_MAX_INTEGER_VALUE);
    const [count, setCount] = useState<number>(0);

    const updateGpsLogTable = (direction: FetchDirection) => {
        apiGetGpsLogCount()
        .then(cnt => {
            setCount(cnt);
            return apiGetSession(current, direction);
        })
        .then(l => {
            if (l.length > 0) {
                setGpsLogs(l);
                setCenter([l[0].latitude, l[0].longitude]);
                setCurrent(l[0].session);
            }
        })
        .catch(e => console.trace(e));
    }

    // Initialization
    useEffect(() => {
        updateGpsLogTable(FetchDirection.PREVIOUS);
    }, []);

    return (
        <>
            <LogComp gpsLogs={gpsLogs} center={center} zoom={12} />
            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => updateGpsLogTable(FetchDirection.NEXT)}>&lt;</button>
               {/* <div style={{ fontSize: "1.3rem" }}>{current + 1}/{count}</div> */}
               <div style={{ fontSize: "1.3rem" }}>{current + 1}/{count}</div>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => updateGpsLogTable(FetchDirection.PREVIOUS)}>&gt;</button>
            </div>
        </>
    )
}
import { FC, useEffect, useState } from "react";
import '../App.css';

import { GpsLogResponse } from "../api/structure";
import { apiGetGpsLogCount, FetchDirection, apiGetSession } from "../api/rest";
import { LogComp } from "./LogComp";
import { POSTGRES_MAX_INTEGER_VALUE } from "../util/constants";
import { toLocalTime } from "../util/convert";

export const LogPage: FC<{}> = _ => {

    const [gpsLogs, setGpsLogs] = useState<Array<GpsLogResponse>>([]);
    const [current, setCurrent] = useState<number>(POSTGRES_MAX_INTEGER_VALUE);
    const [index, setIndex] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [date, setDate] = useState<string>("");

    const updateGpsLogTable = (direction: FetchDirection) => {
        apiGetGpsLogCount()
        .then(cnt => {
            setCount(cnt);
            return apiGetSession(current, direction);
        })
        .then(l => {
            if (l.length > 0) {
                setGpsLogs(l);
                setCurrent(l[0].session);
                setDate(toLocalTime(l[0].datetime));
                if (direction == FetchDirection.PREVIOUS) {
                    setIndex(index => index + 1)
                } else if (direction = FetchDirection.NEXT) {
                    setIndex(index => index - 1)
                }
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
            <LogComp gpsLogs={gpsLogs} zoom={12} />

            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => updateGpsLogTable(FetchDirection.NEXT)}>&lt;</button>
               <div style={{ fontSize: "1rem" }}>{date} ({index}/{count})</div>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => updateGpsLogTable(FetchDirection.PREVIOUS)}>&gt;</button>
            </div>
        </>
    )
}
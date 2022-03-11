import { FC, useEffect, useState } from "react";
import { LIMIT, ORDER_BY_DISTANCE } from "../util/constants";
import Modal from "react-modal";
import '../App.css';
import { modalStyle } from "./styles";
import { apiGetRecordsEveryNth, apiGetRecordsEveryNthOrderByDistance } from "../api-myphotos/myphotos";
import { LatLon, RecordEveryNthResponse } from "../api-myphotos/structure";
import { toLocalTime } from "../util/convert";

const backward = (offset: number) => (offset >= LIMIT) ? offset - LIMIT : offset;

const forward = (offset: number, count: number) => ((offset + LIMIT) >= count) ? offset : offset + LIMIT;

export type PhotoFooterProps = {
    latlon: LatLon | null
    count: number;
    offset: number;
    setOffset: (offset: number) => void;
}

export const PhotoFooter: FC<PhotoFooterProps> = ({ latlon, count, offset, setOffset }) => {

    const [showIndex, setShowIndex] = useState<boolean>(false);
    const [index, setIndex] = useState<Array<RecordEveryNthResponse>>([]);

    const getIndex = () => {
        if (latlon == null) {
            apiGetRecordsEveryNth(LIMIT)
                .then(index => setIndex(index));
        } else {
            apiGetRecordsEveryNthOrderByDistance(latlon.latitude, latlon.longitude, LIMIT)
                .then(index => setIndex(index));
        }
    }

    const onShowIndex = () => {
        if (latlon != null) {
            getIndex();
        }
        setShowIndex(true);
    }

    const jump = (idx: number) => {
        setOffset(idx * LIMIT);
        setShowIndex(false);
    }

    useEffect(() => {
        if (!ORDER_BY_DISTANCE) {
            getIndex();
        }
    }, []);

    return (
        <>
            <Modal isOpen={showIndex} style={modalStyle}>
                <div id="navi" style={{ position: "absolute", justifyContent: "center" }}>
                    <div id="navi-center">Index</div>
                </div>
                <div className="default-modal">
                    {index.map((r, idx) => (
                        <div key={r.id} className="card">
                            <div style={{ width: "8%", color: "purple" }}>
                                {idx + 1}
                            </div>
                            <div className="card-text">
                                <div>Date: {toLocalTime(r.timestamp)}</div>
                                <div>Place: {r.place}</div>
                            </div>
                            <div className="card-map">
                                <button className="tiny-button-record" onClick={e => jump(idx)}>Jump</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="footer" style={{ position: "absolute" }}>
                    <button className="small-button" type="submit" onClick={e => setShowIndex(false)}>Close</button>
                </div>
            </Modal>

            <div className="footer">
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(backward(offset))}>&lt;</button>
                <button className="small-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => onShowIndex()}>
                    {Math.floor(offset / LIMIT) + 1}/{Math.floor((count + LIMIT - 1) / LIMIT)}
                </button>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset, count))}>&gt;</button>
            </div>
        </>
    );
} 
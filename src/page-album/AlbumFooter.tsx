import { FC, useEffect, useRef, useState } from "react";
import { LIMIT } from "../util/constants";
import Modal from "react-modal";
import '../App.css';
import { modalStyle } from "../components-common/styles";
import { apiGetRecordsEveryNth, apiGetRecordsEveryNthOrderByDistance } from "../api-myphotos/myphotos";
import { LatLon, RecordEveryNthResponse } from "../api-myphotos/structure";
import { toLocalTime } from "../util/convert";

const backward = (offset: number) => (offset >= LIMIT) ? offset - LIMIT : offset;
const forward = (offset: number, count: number) => ((offset + LIMIT) >= count) ? offset : offset + LIMIT;

export type AlbumFooterProps = {
    latlon: LatLon | null;
    closestOrder: boolean;
    isWatching: boolean;
    count: number;
    offset: number;
    setOffset: (offset: number) => void;
}

export const AlbumFooter: FC<AlbumFooterProps> = ({ latlon, closestOrder, isWatching, count, offset, setOffset }) => {

    const [showIndex, setShowIndex] = useState<boolean>(false);
    const [index, setIndex] = useState<Array<RecordEveryNthResponse>>([]);

    const ref = useRef<Array<HTMLDivElement | null>>([]);

    const updateIndex = () => {
        if (closestOrder && latlon != null) {
            apiGetRecordsEveryNthOrderByDistance(latlon.latitude, latlon.longitude, LIMIT)
                .then(index => setIndex(index));
        } else {
            apiGetRecordsEveryNth(LIMIT)
                .then(index => setIndex(index));
        }
    }

    const onShowIndex = () => {
        if (closestOrder && latlon != null) {
            updateIndex();
        }
        setShowIndex(true);
    }

    const jump = (idx: number) => {
        setOffset(idx * LIMIT);
        setShowIndex(false);
    }

    const scrollInto = () => {
        const to = selectedPage <= 2 ? 0 : selectedPage - 2;
        ref.current[to]?.scrollIntoView({ behavior: "smooth" })
    }

    const onBackwardButtonClicked = () => {
        setOffset(backward(offset))
    }

    const onForwardButtonClicked = () => {
        setOffset(forward(offset, count))
    }

    const selectedPage = Math.floor(offset / LIMIT) + 1;
    const totalPages = Math.floor((count + LIMIT - 1) / LIMIT);

    useEffect(() => {
        if ((!closestOrder || isWatching) && count > 0) {
            updateIndex();
            //console.log("[AlbumFooter]", closestOrder, isWatching, count)
        }
    }, [closestOrder, isWatching, count]);

    return (
        <>
            <Modal isOpen={showIndex} style={modalStyle}>
                <div id="navi" style={{ position: "absolute", justifyContent: "center" }}>
                    <div id="navi-center">Index</div>
                </div>
                <div className="default-modal" onClick={e => scrollInto()}>
                    {index.map((r, idx) => (
                        <div key={r.uuid} ref={el => ref.current[idx] = el} className="card">
                            {(selectedPage === idx + 1) ?
                                <div style={{ width: "8%", color: "purple", fontWeight: "bold" }}>{idx + 1}</div>
                                :
                                <div style={{ width: "8%", color: "gray" }}>{idx + 1}</div>
                            }
                            <div className="card-text">
                                <div>Date: {toLocalTime(r.timestamp__c)}</div>
                                {r.distance && <div>Date: {r.distance.toFixed(2)} km</div>}
                                <div>Place: {r.name}</div>
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
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={onBackwardButtonClicked}>&lt;</button>
                <button className="small-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={onShowIndex}>
                    {selectedPage}/{totalPages}
                </button>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={onForwardButtonClicked}>&gt;</button>
            </div>
        </>
    );
};
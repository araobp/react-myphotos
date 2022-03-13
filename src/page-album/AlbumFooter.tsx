import { FC, useEffect, useState } from "react";
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
    gpsEnabled: boolean;
    isWatching: boolean;
    count: number;
    offset: number;
    setOffset: (offset: number) => void;
}

export const AlbumFooter: FC<AlbumFooterProps> = ({ latlon, gpsEnabled, isWatching, count, offset, setOffset }) => {

    const [showIndex, setShowIndex] = useState<boolean>(false);
    const [index, setIndex] = useState<Array<RecordEveryNthResponse>>([]);

    const updateIndex = () => {
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
            updateIndex();
        }
        setShowIndex(true);
    }

    const jump = (idx: number) => {
        setOffset(idx * LIMIT);
        setShowIndex(false);
    }

    const selectedPage = () => Math.floor(offset / LIMIT) + 1;
    const totalPages = () => Math.floor((count + LIMIT - 1) / LIMIT);

    const onBackwardButtonClicked = () => {
        setOffset(backward(offset))
    }

    const onForwardButtonClicked = () => {
        setOffset(forward(offset, count))
    }

    // Initialization
    useEffect(() => {
        if (!gpsEnabled) {
            updateIndex();
        }
    }, []);

    useEffect(() => {
        updateIndex();
    }, [isWatching]);

    let selected: number = 1;
    let page: number = 1;

    return (
        <>
            {selected = selectedPage()}
            <Modal isOpen={showIndex} style={modalStyle}>
                <div id="navi" style={{ position: "absolute", justifyContent: "center" }}>
                    <div id="navi-center">Index</div>
                </div>
                <div className="default-modal">
                    {index.map((r, idx) => (
                        <div key={r.id} className="card">
                            {(selected == idx + 1) ?
                                <div style={{ width: "8%", color: "purple", fontWeight: "bold" }}>{idx + 1}</div>
                                :
                                <div style={{ width: "8%", color: "gray" }}>{idx + 1}</div>
                            }
                            <div className="card-text">
                                <div>Date: {toLocalTime(r.timestamp)}</div>
                                {r.distance && <div>Date: {r.distance.toFixed(2)} km</div>}
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
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={onBackwardButtonClicked}>&lt;</button>
                <button className="small-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={onShowIndex}>
                    {selectedPage()}/{totalPages()}
                </button>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={onForwardButtonClicked}>&gt;</button>
            </div>
        </>
    );
} 
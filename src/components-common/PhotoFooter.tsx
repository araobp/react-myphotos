import { FC, useEffect, useState } from "react";
import { LIMIT } from "../util/constants";
import Modal from "react-modal";
import '../App.css';
import { modalStyle } from "./styles";
import { apiGetRecordsEveryNth } from "../api-myphotos/myphotos";
import { RecordEveryNthResponse } from "../api-myphotos/structure";
import { toLocalTime } from "../util/convert";

const backward = (offset: number) => (offset >= LIMIT) ? offset - LIMIT : offset;

const forward = (offset: number, count: number) => ((offset + LIMIT) >= count) ? offset : offset + LIMIT;

export type PhotoFooterProps = {
    count: number;
    offset: number;
    setOffset: (offset: number) => void;
}

export const PhotoFooter: FC<PhotoFooterProps> = ({ count, offset, setOffset }) => {

    const [showIndex, setShowIndex] = useState<boolean>(false);
    const [index, setIndex] = useState<Array<RecordEveryNthResponse>>([]);

    const getIndex = () => {
        apiGetRecordsEveryNth(LIMIT)
            .then(index => setIndex(index));
    }

    const jump = (idx: number) => {
        setOffset(idx * LIMIT);
        setShowIndex(false);
    }

    useEffect(() => {
        getIndex();
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
                                {idx}
                            </div>
                            <div className="card-text">
                                <div>Date: {toLocalTime(r.datetime)}</div>
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
                <button className="small-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setShowIndex(true)}>
                    {Math.floor(offset / LIMIT) + 1}/{Math.floor((count + LIMIT - 1) / LIMIT)}
                </button>
                <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset, count))}>&gt;</button>
            </div>
        </>
    );
} 
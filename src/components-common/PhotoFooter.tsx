import { FC } from "react";
import { LIMIT } from "../util/constants";
import '../App.css';

const backward = (offset: number) => (offset >= LIMIT) ? offset - LIMIT : offset;

const forward = (offset: number, count: number) => ((offset + LIMIT) >= count) ? offset : offset + LIMIT;

export type PhotoFooterProps = {
    count: number;
    offset: number;
    setOffset: (offset: number) => void;
}

export const PhotoFooter: FC<PhotoFooterProps> = ({ count, offset, setOffset }) => {
    return (
        <div className="footer">
            <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(backward(offset))}>&lt;</button>
            <div style={{ fontSize: "1.3rem" }}>{Math.floor(offset / LIMIT) + 1}/{Math.floor((count + LIMIT - 1) / LIMIT)}</div>
            <button className="tiny-button" style={{ fontSize: "1.3rem" }} type="submit" onClick={e => setOffset(forward(offset, count))}>&gt;</button>
        </div>
    );
} 
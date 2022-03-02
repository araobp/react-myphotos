import { FC } from "react";
import '../App.css';

export type CloseFooterProps = {
    onClose: () => void;
}

export const CloseFooter: FC<CloseFooterProps> = ({ onClose }) => {
    return (
        <div className="footer">
            <button className="small-button" onClick={e => onClose()}>Close</button>
        </div>
    );
} 
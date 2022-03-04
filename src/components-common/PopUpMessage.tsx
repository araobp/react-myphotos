import { FC } from "react";
import Modal from "react-modal";
import '../App.css';

export type PopUpProps = {
    isAlert?: boolean;
    message: string;
}

export type PopUpConfirmProps = {
    message: string;
    onConfirm: (confirmed: boolean) => void;
}

export const PopUpMessage: FC<PopUpProps> = ({ isAlert = false, message }) => {
    const className: string = isAlert ? "popup-alert" : "popup";

    return (
        <>
            <Modal isOpen={true} className="center">
                <div className={className}>
                    <p>{message}</p>
                </div>
            </Modal>
        </>
    );
}

export const PopUpConfirm: FC<PopUpConfirmProps> = ({ message, onConfirm }) => {
    return (
        <>
            <Modal isOpen={true} className="center">
                <div className="popup">
                    <p>{message}</p>
                    <div className="row">
                        <button className="small-button-cancel" onClick={() => onConfirm(false)}>Cancel</button>
                        <button className="small-button-confirm" onClick={() => onConfirm(true)}>Delete</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
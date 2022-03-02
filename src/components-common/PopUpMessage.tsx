import { FC } from "react";
import Modal from "react-modal";
import '../App.css';

export type PopUpProps = {
    isAlert: boolean;
    message: string;
}

export type PopUpConfirmProps = {
    message: string;
    callback: (confirmed: boolean) => void;
}

export const PopUp: FC<PopUpProps> = ({ isAlert, message }) => {
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

export const PopUpConfirm: FC<PopUpConfirmProps> = ({ message, callback }) => {
    return (
        <>
            <Modal isOpen={true} className="center">
                <div className="popup">
                    <p>{message}</p>
                    <div className="row">
                        <button className="small-button-cancel" onClick={() => callback(false)}>Cancel</button>
                        <button className="small-button-confirm" onClick={() => callback(true)}>Delete</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
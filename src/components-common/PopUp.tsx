import { FunctionComponent } from "react";
import Modal from "react-modal";
import '../App.css';

export type PopUpProps = {
    showPopUp: boolean;
    isAlert: boolean;
    message: string;
}

export type PopUpConfirmProps = {
    showPopUp: boolean;
    message: string;
    callback: (confirmed: boolean) => void;
}

export const PopUp: FunctionComponent<PopUpProps> = ({ showPopUp, isAlert, message }: PopUpProps) => {
    const className: string = isAlert ? "popup-alert" : "popup";

    return (
        <>
            <Modal isOpen={showPopUp} className="center">
                <div className={className}>
                    <p>{message}</p>
                </div>
            </Modal>
        </>
    );
}

export const PopUpConfirm: FunctionComponent<PopUpConfirmProps> = ({ showPopUp, message, callback }: PopUpConfirmProps) => {
    return (
        <>
            <Modal isOpen={showPopUp} className="center">
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
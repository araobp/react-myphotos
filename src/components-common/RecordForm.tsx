import { FC } from "react";
import './recordform.css';

type FormProps = {
    place: string;
    setPlace: (place: string) => void;
    memo: string;
    setMemo: (memo: string) => void;
}

export const RecordForm: FC<FormProps> = ({ place, setPlace, memo, setMemo }) => {
    return (
        <>
            <div id="place">
                <div>Place:</div>
                    <input
                        id="place-input"
                        type="text"
                        name="place"
                        value={place}
                        onChange={e => setPlace(e.target.value)}
                    />
                
            </div>

            <div id="memo">
                <div>Memo:</div>
                <textarea
                    id="memo-input"
                    name="memo"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    rows={3}
                />
            </div>
        </>
    );
}
import { FC } from "react";
import '../App.css';

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
                <label>Place:
                    <input
                        style={{width: "50%"}}
                        type="text"
                        name="place"
                        value={place}
                        onChange={e => setPlace(e.target.value)}
                    />
                </label>
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
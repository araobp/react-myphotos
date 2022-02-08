import { FunctionComponent } from "react";

type FormProps = {
    place: string;
    setPlace: (place: string) => void;
    memo: string;
    setMemo: (memo: string) => void;
}

export const RecordForm: FunctionComponent<FormProps> = ({ place, setPlace, memo, setMemo }: FormProps) => {
    return (
        <>
            <div id="place">
                <label>Place:
                    <input
                        type="text"
                        name="place"
                        value={place}
                        onChange={e => setPlace(e.target.value)}
                    />
                </label>
            </div>

            <div id="memo">
                <div>Memo:</div>
                <textarea id="memo-input"
                    name="memo"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    rows={3}
                />
            </div>
        </>
    );
}
import { FC } from "react";
import './recordform.css';

type FormProps = {
    name: string;
    setName: (name: string) => void;
    memo: string;
    setMemo: (memo: string) => void;
}

export const RecordForm: FC<FormProps> = ({ name, setName, memo, setMemo }) => {
    return (
        <>
            <div id="name">
                <div>Name:</div>
                    <input
                        id="name-input"
                        type="text"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
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
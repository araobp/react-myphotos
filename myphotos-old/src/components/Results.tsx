import { AnyRecord } from "dns";
import { prependListener } from "process";
import { Record } from '../App';

interface RecordsPropsType {
    records: Record[];
}

const Results: React.FunctionComponent<RecordsPropsType> = ({ records }) => {
    return (
        <div>
            <h2>Records</h2>

            <ul>
                {records.map(record => {
                    <li>...</li>
                    const { datetime, place, memo, format, image } = record;
                    <li>{datetime}, {place}, {memo}, {format}</li>
                })}
            </ul>
        </div>
    );
};

export default Results;

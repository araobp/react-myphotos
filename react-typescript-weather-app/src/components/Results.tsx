import { prependListener } from "process";

type ResultsPropsType = {
    results: {
        country: string,
        cityName: string,
        temperature: string,
        conditionText: string,
        icon: string
    }
}

const Results = (props: ResultsPropsType) => {
    return (
        <div>
            {props.results.cityName && <div>{props.results.cityName}</div>}
            {props.results.temperature && <div>{props.results.temperature}<span> degrees</span></div>}
            {props.results.conditionText &&
                <div>
                    <img src={props.results.icon} alt="icon" />
                    <span>{props.results.conditionText}</span>
                </div>
            }
        </div>
    );
};

export default Results;
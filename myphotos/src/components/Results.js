const Results = ({results}) => {
    const {cityName, country, temperature, conditionText, icon} = results;
    return (
        <div>
            {cityName && <div>{cityName}</div>}
            {temperature && <div>{temperature}<span> degrees</span></div>}
            {conditionText &&
                <div>
                    <img src={icon} alt="icon" />
                    <span>{conditionText}</span>
                </div>
            }
        </div>
    );
};

export default Results;
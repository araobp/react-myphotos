import React from "react";

const Form = ({ setDateTime, getRecord, getRecords }) => {
    return (
        <>
            <form onSubmit={getRecord}>
                <input type="text" name="record" placeholder="datetime" onChange={e => setDateTime(e.target.value)} />
                <button type="submit">Get Record</button>
            </form>
            <form onSubmit={getRecords}>
                <button type="submit">Get Records</button>
            </form>
        </>
    );
};

export default Form;
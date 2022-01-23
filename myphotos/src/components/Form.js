import React from "react";

const Form = ({ setId, getRecord, getRecords }) => {
    return (
        <>
            <form onSubmit={getRecord}>
                <input type="text" name="record" placeholder="id" onChange={e => setId(e.target.value)} />
                <button type="submit">Get Record</button>
            </form>
            <form onSubmit={getRecords}>
                <button type="submit">Get Records</button>
            </form>
        </>
    );
};

export default Form;
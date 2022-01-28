import React from "react";
import '../App.css';

const Form = ({ setId, getRecord, getRecords }) => {
    return (
        <>
            <form onSubmit={getRecord}>
                <input type="text" name="id" placeholder="id" onChange={e => setId(e.target.value)} />
                <button className="small-button" type="submit">Get Record</button>
            </form>
            
            <form onSubmit={getRecords}>
                <button className="small-button" type="submit">Get Records</button>
            </form>
        </>
    );
};

export default Form;
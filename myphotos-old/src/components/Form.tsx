
import React from "react";
import { isReturnStatement } from "typescript";

type FormPropsType = {
    getRecords: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({ getRecords }: FormPropsType) => {
    return (
            <form onSubmit={getRecords}>
                <button type="submit">Get Records</button>
            </form>
    );
};

export default Form;

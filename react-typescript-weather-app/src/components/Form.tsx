
import React from "react";
import { isReturnStatement } from "typescript";

type FormPropsType = {
    setCity: React.Dispatch<React.SetStateAction<string>>;
    getWeather: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({setCity, getWeather}: FormPropsType) => {
    return (
        <form onSubmit={getWeather}>
            <input type="text" name="city" placeholder="City name" onChange={e => setCity(e.target.value)} />
            <button type="submit">Get Weather</button>
        </form>
    );
};

export default Form;

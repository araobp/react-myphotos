import { useState } from "react";
import { isReturnStatement } from "typescript";

const Form=()=>{
    const[city, setCity]=useState<string>("");
    const getWeather=(e: any)=>{
        e.preventDefault();
        fetch("https://api.weatherapi.com/v1/current.json?key=97dd9644f14c4794aed13740221801&q=London&aqi=no")
        .then(res=>res.json())
        .then(data=>console.log(data))
    }
    return(
        <form>
            <input type="text" name="city" placeholder="City name" onChange={e => setCity(e.target.value)}/>
            <button type="submit" onClick={getWeather}>Get Weather</button>
        </form>
    );
};

export default Form;

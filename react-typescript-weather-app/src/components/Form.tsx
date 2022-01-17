import { useState } from "react";

const Form=()=>{
    const[city, setCity]=useState("");
    return(
        <form>
            <input type="text" name="city" placeholder="City name"/>
            <button type="submit">Get Weather</button>
        </form>
    );
};

export default Form;
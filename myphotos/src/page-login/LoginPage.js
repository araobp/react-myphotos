import React, { useState } from "react";  // named export
import '../App.css';

export const LoginPage = ({ setLoginName }) => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const saveCredential = () => {
        if (login != "" && password != "") {
            localStorage.setItem("login", login);
            localStorage.setItem("password", password);
            setLoginName(login);
            setLogin("");
            setPassword("");
        }
    }

    return (
        <div className="default">
            <input
                style={{ width: "16rem" }}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="login"
            />
            <br></br>
            <input
                style={{ width: "16rem" }}
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
            />
            <br></br>
            <button className="small-button" type="submit" onClick={e => saveCredential()}>Submit</button>
        </div>
    );
}
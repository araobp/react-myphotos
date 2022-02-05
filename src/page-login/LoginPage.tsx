import React, { useState, useEffect, FC } from "react";  // named export
import '../App.css';

export const LoginPage = ({ setLoginName }) => {

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [baseURL, setBaseURL] = useState<string>("");
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

    const saveCredential = () => {
        if (login != "" && password != "") {
            localStorage.setItem("login", login);
            localStorage.setItem("password", password);
            setLoginName(login);
            setLogin("");
            setPassword("");
        }
        if (baseURL != "") {
            localStorage.setItem("baseURL", baseURL);
        }
    }

    const toggleAdvancedSetting = () => {
        setShowAdvanced(!showAdvanced);
    }

    useEffect(() => {
        const url = localStorage.getItem("baseURL");
        if (url) {
            setBaseURL(url);
        }
    }, []);

    return (
        <>
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
                {showAdvanced &&
                    <input
                        style={{ width: "28rem" }}
                        type="text"
                        value={baseURL}
                        onChange={(e) => setBaseURL(e.target.value)}
                        placeholder="BASE URL"
                    />
                }
                <br></br>
                <button className="small-button" type="submit" onClick={e => toggleAdvancedSetting()}>Advanced</button>
            </div>
            <div className="footer">
                <button className="small-button" type="submit" onClick={e => saveCredential()}>Submit</button>
            </div>
        </>

    );
}
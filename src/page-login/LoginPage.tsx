import React, { useState, useEffect, FC } from "react";  // named export
import '../App.css';

type LoginPageProps = {
    setLoginName: React.Dispatch<React.SetStateAction<string>>;
}

export const LoginPage = ({ setLoginName }: LoginPageProps) => {

    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");
    const [password, setPassword] = useState<string>(localStorage.getItem("password") || "");
    const [baseURL, setBaseURL] = useState<string>(localStorage.getItem("baseURL") || "");
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

    return (
        <>
            <div className="default">
                <label>login:
                    <input
                        style={{ width: "16rem" }}
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="login"
                    />
                </label>
                <br></br>
                <label>password:
                    <input
                        style={{ width: "16rem" }}
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                    />
                </label>
                <br></br>
                {showAdvanced &&
                    <label>baseURL:
                        <input
                            style={{ width: "28rem" }}
                            type="text"
                            value={baseURL}
                            onChange={(e) => setBaseURL(e.target.value)}
                            placeholder="BASE URL"
                        />
                    </label>
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
import React, { useState, FunctionComponent, FC } from "react";  // named export
import '../App.css';

import { Switch } from "../components-common/Switch";

type SettingsPageProps = {
    setLoginName: React.Dispatch<React.SetStateAction<string>>;
}

export const SettingsPage: FC<SettingsPageProps> = ({ setLoginName }) => {

    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");
    const [password, setPassword] = useState<string>(localStorage.getItem("password") || "");
    const [baseURL, setBaseURL] = useState<string>(localStorage.getItem("baseURL") || "");
    const [webcamEnabled, setWebcamEnabled] = useState<string>(localStorage.getItem("webcamEnabled") || "false");
    const [period, setPeriod] = useState<string>(localStorage.getItem("period") || "");
    const [limit, setLimit] = useState<string>(localStorage.getItem("limit") || "");
    const [resolution, setResolution] = useState<string>(localStorage.getItem("resolution") || "");
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

    const saveSettings = () => {
        if (login != "" && password != "") {
            localStorage.setItem("login", login);
            localStorage.setItem("password", password);
            localStorage.setItem("period", period);
            localStorage.setItem("limit", limit);
            localStorage.setItem("resolution", resolution);
            setLoginName(login);
        }
        if (baseURL != "") {
            localStorage.setItem("baseURL", baseURL);
        }
        localStorage.setItem("webcamEnabled", webcamEnabled);
    }

    const toggleAdvancedSetting = () => {
        setShowAdvanced(!showAdvanced);
    }

    const onWebcamEnabled = (isChecked: boolean) => {
        isChecked ? setWebcamEnabled("true") : setWebcamEnabled("false");
        console.log(isChecked);
    }

    const onResolutionChanged= (factor: string) => {
        const v = parseFloat(factor);
        if (v != NaN && v > 0 && v < 1) {
            setResolution(factor);
        } 
    }

    return (
        <>
            <div className="default" style={{ textAlign: "left", marginLeft: "1rem", marginRight: "1rem" }}>
                <label>Login:
                    <input
                        style={{ width: "16rem" }}
                        type="text"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                        placeholder="login"
                    />
                </label>
                <br />
                <label>Password:
                    <input
                        style={{ width: "16rem" }}
                        type="text"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="password"
                    />
                </label>
                {showAdvanced &&
                    <div>
                        <br />
                        <label>Resolution:
                            <input
                                style={{ width: "6rem" }}
                                type="text"
                                value={resolution}
                                onChange={e => onResolutionChanged(e.target.value)}
                                placeholder="factor"
                            />
                            (range: 0 ~ 1)
                        </label>

                        <br />
                        <label>Images:
                            <input
                                style={{ width: "6rem" }}
                                type="text"
                                value={limit}
                                onChange={e => setLimit(e.target.value)}
                                placeholder="number"
                            />
                            per page
                        </label>

                        <div>
                            <label>baseURL:
                                <input
                                    style={{ width: "28rem" }}
                                    type="text"
                                    value={baseURL}
                                    onChange={e => setBaseURL(e.target.value)}
                                    placeholder="BASE URL"
                                />
                            </label>

                            <br />
                            <div style={{ display: "flex", alignItems: "center" }}>WebCam:&nbsp;<Switch isChecked={webcamEnabled == "true"} onChange={isChecked => onWebcamEnabled(isChecked)} />
                            </div>
                        </div>
                    </div>
                }
                <br />
                <div style={{ textAlign: "center" }}>
                    <button className="small-button" type="submit" onClick={e => toggleAdvancedSetting()}>Advanced</button>
                </div>
            </div>
            <div className="footer">
                <button className="small-button" type="submit" onClick={e => saveSettings()}>Submit</button>
            </div>
        </>

    );
}
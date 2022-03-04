import React, { useState, FunctionComponent, FC } from "react";  // named export
import '../App.css';
import { PopUp } from "../components-common/PopUpMessage";

import { Switch } from "../components-common/Switch";

type SettingsPageProps = {
    setLoginName: React.Dispatch<React.SetStateAction<string>>;
}

export const SettingsPage: FC<SettingsPageProps> = ({ setLoginName }) => {

    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");
    const [password, setPassword] = useState<string>(localStorage.getItem("password") || "");
    const [baseURL, setBaseURL] = useState<string>(localStorage.getItem("baseURL") || "");
    const [webcamEnabled, setWebcamEnabled] = useState<string>(localStorage.getItem("webcamEnabled") || "false");
    const [thetaEnabled, setThetaEnabled] = useState<string>(localStorage.getItem("thetaEnabled") || "false");
    const [limit, setLimit] = useState<string>(localStorage.getItem("limit") || "");
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [showProgress, setShowProgress] = useState<boolean>(false);

    const saveSettings = () => {
        if (login != "" && password != "") {
            localStorage.setItem("login", login);
            localStorage.setItem("password", password);
            localStorage.setItem("limit", limit);
            setLoginName(login);
        }
        if (baseURL != "") {
            localStorage.setItem("baseURL", baseURL);
        }
        localStorage.setItem("webcamEnabled", webcamEnabled);
        localStorage.setItem("thetaEnabled", thetaEnabled);

        setTimeout(() => setShowProgress(false), 1000);
        setShowProgress(true);
    }

    const toggleAdvancedSetting = () => {
        setShowAdvanced(!showAdvanced);
    }

    const onWebcamEnabled = (isChecked: boolean) => {
        isChecked ? setWebcamEnabled("true") : setWebcamEnabled("false");
    }

    const onThetaEnabled = (isChecked: boolean) => {
        isChecked ? setThetaEnabled("true") : setThetaEnabled("false");
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
                            <div style={{ display: "flex", alignItems: "center" }}>RICOH Theta:&nbsp;
                                <Switch isChecked={thetaEnabled == "true"} onChange={isChecked => onThetaEnabled(isChecked)} />
                            </div>

                            <br />
                            <div style={{ display: "flex", alignItems: "center" }}>Mac/PC mode:&nbsp;
                                <Switch isChecked={webcamEnabled == "true"} onChange={isChecked => onWebcamEnabled(isChecked)} />
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

            {showProgress && <PopUp isAlert={false} message={'Parameters saved'} />}

        </>

    );
}
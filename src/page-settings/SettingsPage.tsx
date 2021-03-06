import { useState, FC } from "react";
import '../App.css';

import { PopUpMessage } from "../components-common/PopUpMessage";
import { Switch } from "../components-common/Switch";

export const SettingsPage: FC = () => {

    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");
    const [password, setPassword] = useState<string>(localStorage.getItem("password") || "");
    const [baseURL, setBaseURL] = useState<string>(localStorage.getItem("baseURL") || "");
    const [webcamEnabled, setWebcamEnabled] = useState<string>(localStorage.getItem("webcamEnabled") || "false");
    const [resolution, setResolution] = useState<string>(localStorage.getItem("resolution") || "");
    const [mobileCameraEnabled, setMobileCameraEnabled] = useState<string>(localStorage.getItem("mobileCameraEnabled") || "false");
    const [fileInputEnabled, setFileInputEnabled] = useState<string>(localStorage.getItem("fileInputEnabled") || "false");
    const [limit, setLimit] = useState<string>(localStorage.getItem("limit") || "");
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [showProgress, setShowProgress] = useState<boolean>(false);

    const saveSettings = () => {
        if (login != "" && password != "") {
            localStorage.setItem("login", login);
            localStorage.setItem("password", password);
            localStorage.setItem("limit", limit);
        }
        if (baseURL != "") {
            localStorage.setItem("baseURL", baseURL);
        }
        localStorage.setItem("webcamEnabled", webcamEnabled);
        localStorage.setItem("resolution", resolution);
        localStorage.setItem("mobileCameraEnabled", mobileCameraEnabled);
        localStorage.setItem("fileInputEnabled", fileInputEnabled);

        setTimeout(() => setShowProgress(false), 1000);
        setShowProgress(true);
    }

    const toggleAdvancedSetting = () => {
        setShowAdvanced(!showAdvanced);
    }

    const onWebcamEnabled = (isChecked: boolean) => {
        setWebcamEnabled(isChecked.toString());
    }

    const onMobileCameraEnabled = (isChecked: boolean) => {
        setMobileCameraEnabled(isChecked.toString());
    }

    const onFileInputEnabled = (isChecked: boolean) => {
        setFileInputEnabled(isChecked.toString());
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
                        <hr />

                        <div>
                            <label>BaseURL:
                                <input
                                    style={{ width: "28rem" }}
                                    type="text"
                                    value={baseURL}
                                    onChange={e => setBaseURL(e.target.value)}
                                    placeholder="BASE URL"
                                />
                            </label>
                        </div>

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

                        <Switch
                            isChecked={webcamEnabled == "true"}
                            label="WebCam:"
                            onChange={isChecked => onWebcamEnabled(isChecked)}
                        />

                        <label>Resolution:
                            <input
                                style={{ width: "6rem" }}
                                type="text"
                                value={resolution}
                                onChange={e => setResolution(e.target.value)}
                                placeholder="0.0 ~ 1.0"
                            />
                        </label>

                        <Switch
                            isChecked={mobileCameraEnabled == "true"}
                            label="Camera:"
                            onChange={isChecked => onMobileCameraEnabled(isChecked)}
                        />

                        <Switch
                            isChecked={fileInputEnabled == "true"}
                            label="File:"
                            onChange={isChecked => onFileInputEnabled(isChecked)}
                        />

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

            {showProgress && <PopUpMessage message={'Parameters saved'} />}

        </>

    );
}
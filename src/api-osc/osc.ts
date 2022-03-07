/**
 *  RICOH THETA API based on OSC
 *  https://api.ricoh/docs/theta-web-api-v2.1/
 */

const baseURL = 'http://192.168.1.1:80';

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const PATH_COMMAND = '/osc/commands/execute';
const PATH_STATE = '/osc/state';
const PATH_CHECK_FOR_UPDATES = '/osc/checkForUpdates'

/*** Basic APIs ***/
export const apiCommand = async (command: object | null) => {
    const body = (command == null) ? null : JSON.stringify(command);
    const res = await fetch(`${baseURL}${PATH_COMMAND}`, { method: "POST", mode: 'cors', headers: HEADERS, body: body })
    if (res.status != 200) throw { success: false, reason: `POST ${PATH_COMMAND} failed` };
    return await res.json();
}

export const apiState = async () => {
    const res = await fetch(`${baseURL}${PATH_STATE}`, { method: "POST", mode: 'no-cors', headers: HEADERS })
    if (res.status != 200) throw { success: false, reason: `POST ${PATH_COMMAND} failed` };
    return await res.json();
}

export const apiCheckForUpdates = async () => {
    const res = await fetch(`${baseURL}${PATH_CHECK_FOR_UPDATES}`, { method: "POST", mode: 'no-cors', headers: HEADERS })
    if (res.status != 200) throw { success: false, reason: `POST ${PATH_CHECK_FOR_UPDATES} failed` };
    return await res.json();
}

/*** API sequences ***/

export const apiStartSession = async () => {
    const res = await apiCommand({
        name: "camera.startSession",
        parameters: {}
    });
    console.log(res);
    const sessionId = res.results.sessionId;
    const res2 = await apiCommand({
        name: "camera.setOptions",
        parameters: {
            sessionId: sessionId,
            options: {
                clientVersion: 2
            }
        }
    })
    return sessionId
}

export const apiGetFileFormatOptions = async () => {
    const res = await apiCommand({
        name: "camera.getOptions",
        parameters: {
            "optionNames": [
                "fileFormat",
                "fileFormatSupport"
            ]
        }
    });
    return res.results.options;
}

export const apiSetFileFormat = async (type: string = "jpeg", width: number, height: number) => {
    return await apiCommand({
        name: "camera.setOptions",
        parameters: {
            options: {
                fileFormat: {
                    type: type,
                    width: width,
                    height: height
                }
            }
        }
    });
}

export const apiGetStateFingerprint = async () => {
    const res = await apiCheckForUpdates();
    return res.stateFingerprint;
}

export const apiGetImage = async () => {
    const res = await apiState();
    const url = res.status._latestFileUrl;
    
    const res2 = await fetch(url, { method: "GET" })
    if (res.status != 200) throw { success: false, reason: `GET image failed` };
    return await res2.blob();
}

export const apiTakePictureAndReturnImage = async () => {
    // Previous fingerprint
    const prevFingerPrint = await apiGetStateFingerprint();
    // Take a picture
    await apiCommand({
        name: "camera.takePicture"
    });
    // Wait for Theta to save it
    let fingePrint = prevFingerPrint;
    while (prevFingerPrint == fingePrint) {
       await new Promise(r => setTimeout(r, 500));
       fingePrint = apiGetStateFingerprint();
    }
    // Fetch the image from Theta
    return await apiGetImage();
}

/*** One line ***/
export const takePicture = async () => {
    await apiStartSession();
    return await apiTakePictureAndReturnImage();
}

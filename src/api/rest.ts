import { authHeaders, baseURL } from "../util/auth";
import { RecordResponse } from "./structure";

import { dataURItoArrayBuffer } from "../util/convert";
import { RecordRequest, LatLon } from "./structure";

export type apiPostRecordCallback = (success: boolean) => void;

export const apiPostRecord = (place: string, memo: string, latlon: LatLon, dataURI: string, callback: apiDeleteRecordsCallback) => {
    const record: RecordRequest = { place: place, memo: memo, latitude: latlon.latitude, longitude: latlon.longitude };

    const body = JSON.stringify(record);
    console.log(body);
    const headers = {
        ...{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        ...authHeaders
    };
    try {
        fetch(`${baseURL}/record`, { method: "POST", headers: headers, body: body })
            .then(res => res.json())
            .then(body => {
                const id = body.id;
                const headers = {
                    ...{
                        'Accept': 'application/json',
                        'Content-Type': 'application/octet-stream'
                    },
                    ...authHeaders
                }
                fetch(
                    `${baseURL}/photo/${id}`,
                    { method: "POST", headers: headers, body: dataURItoArrayBuffer(dataURI) }
                )
                    .then(res => {
                        console.log(res.status);
                        callback(res.status == 200);
                    });
            });
    } catch (e) {
        callback(false);
    }
}


export type apiPutRecordCallback = (success: boolean) => void;

export const apiPutRecord = (id: number, place: string, memo: string, callback: apiPutRecordCallback) => {
    const headers = {
        ...{ 'Content-Type': 'application/json' },
        ...authHeaders
    };
    const body = JSON.stringify({ place: place, memo: memo });
    try {
        fetch(`${baseURL}/record/${id}`, { method: "PUT", headers: headers, body: body })
            .then(res => callback((res.status == 200))
            );
    } catch (e) {
        callback(false);
    }
}

export type apiGetRecordsCallback = (success: boolean, records: Array<RecordResponse>) => void;

export const apiGetRecords = async (limit: number, offset: number, callback: apiGetRecordsCallback) => {
    const headers = {
        ...{ 'Accept': 'application/json' },
        ...authHeaders
    };
    try {
        const res = await fetch(`${baseURL}/record?limit=${limit}&offset=${offset}`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const rec = await res.json();
            callback(true, rec);
        } else {
            callback(false, new Array<RecordResponse>());  // Return empty records
        }
    } catch (e) {
        callback(false, new Array<RecordResponse>());  // Return empty records
    }
}

export type apiGetThumbnailsCallback = (success: boolean, thumbnails: Map<string, string>) => void;

export const apiGetThumbnails = async (rec: Array<RecordResponse>, callback: apiGetThumbnailsCallback) => {
    const headers = {
        ...{ 'Accept': 'application/octet-stream' },
        ...authHeaders
    };
    const thumbnails = new Map<string, string>();
    try {
        let success: boolean = false;
        await Promise.all(rec.map(async (r: RecordResponse) => {
            if (r.id) {
                const res = await fetch(`${baseURL}/photo/${r.id}/thumbnail`, { method: "GET", headers: headers });
                const data = await res.blob();
                thumbnails.set(`id_${r.id}`, URL.createObjectURL(data));
                success = (res.status == 200);
            }
        }));
        callback(success, thumbnails);
    } catch (e) {
        callback(false, new Map<string, string>());  // Return empty map
    }
}

export type apiGetImageCallback = (succes: boolean, objectURL: string) => void;

export const apiGetImage = async (id: number, callback: apiGetImageCallback) => {
    const headers = {
        ...{ 'Accept': 'application/octet-stream' },
        ...authHeaders
    }
    try {
        const res = await fetch(`${baseURL}/photo/${id}/image`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const data = await res.blob();
            callback(true, URL.createObjectURL(data));
        } else {
            callback(false, "");
        }
    } catch (e) {
        callback(false, "");
    }
}

export type apiDeleteRecordsCallback = (success: boolean) => void;

export const apiDeleteRecords = async (checkedRecords: number[], callback: apiDeleteRecordsCallback) => {
    const headers = {
        ...{ 'Accept': 'application/json' },
        ...authHeaders
    };
    let success = true;
    try {
        await Promise.all(checkedRecords.map(async id => {
            const res = await fetch(`${baseURL}/record/${id}`, { method: "DELETE", headers: headers });
            console.log(`status: ${res.status}`);
            if (res.status != 200) success = false;
        }));
        callback(success);
    } catch (e) {
        callback(false);
    }
}

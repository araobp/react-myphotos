import { authHeaders, baseURL } from "../util/auth";
import { RecordResponse } from "./structure";

export type apiPutRecordCallback = (success: boolean) => void;

export const apiPutRecord = (id: number, place: string, memo: string, callback: apiPutRecordCallback) => {
    if (id) {
        const headers = {
            ...{ 'Content-Type': 'application/json' },
            ...authHeaders
        };
        const body = JSON.stringify({ place: place, memo: memo });
        fetch(`${baseURL}/record/${id}`, { method: "PUT", headers: headers, body: body })
            .then(res => callback((res.status == 200))
            );
    }
}

export type apiGetRecordsCallback = (success: boolean, records: Array<RecordResponse>) => void;

export const apiGetRecords = async (limit: number, offset: number, callback: apiGetRecordsCallback) => {
    const headers = {
        ...{ 'Accept': 'application/json' },
        ...authHeaders
    };
    const res = await fetch(`${baseURL}/record?limit=${limit}&offset=${offset}`, { method: "GET", headers: headers });
    if (res.status == 200) {
        const rec = await res.json();
        callback(true, rec);
    } else {
        callback(false, new Array<RecordResponse>());  // Return empty records
    }
}

export type apiGetThumbnailsCallback = (thumbnails: Map<string, string>) => void;

export const apiGetThumbnails = async (rec: Array<RecordResponse>, callback: apiGetThumbnailsCallback) => {
    const headers = {
        ...{ 'Accept': 'application/octet-stream' },
        ...authHeaders
    };
    const thumbnails = new Map<string, string>();
    await Promise.all(rec.map(async (r: RecordResponse) => {
        if (r.id) {
            const res = await fetch(`${baseURL}/photo/${r.id}/thumbnail`, { method: "GET", headers: headers });
            const data = await res.blob();
            thumbnails.set(`id_${r.id}`, URL.createObjectURL(data));
        }
    }));
    callback(thumbnails);
}

export type apiGetImageCallback = (objectURL: string) => void;

export const apiGetImage = (id: number, callback: apiGetImageCallback) => {
    const headers = {
        ...{ 'Accept': 'application/octet-stream' },
        ...authHeaders
    }
    fetch(`${baseURL}/photo/${id}/image`, { method: "GET", headers: headers })
        .then(res => res.blob())
        .then(data => callback(URL.createObjectURL(data)));
}

export type apiDeleteRecordsCallback = (success: boolean) => void;

export const apiDeleteRecords = async (checkedRecords: number[], callback: apiDeleteRecordsCallback) => {
    const headers = {
        ...{ 'Accept': 'application/json' },
        ...authHeaders
    };
    let success = true;
    await Promise.all(checkedRecords.map(async id => {
        const res = await fetch(`${baseURL}/record/${id}`, { method: "DELETE", headers: headers });
        console.log(`status: ${res.status}`);
        if (res.status != 200) success = false;
    }));
    callback(success);
}

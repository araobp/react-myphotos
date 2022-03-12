import { baseURL } from "./myphotosAuth";
import { PhotoAttribute, RecordEveryNthResponse, RecordResponse } from "./structure";

import { dataURItoBlob } from "../util/convert";
import { RecordRequest, LatLon } from "./structure";
import { ACCEPT_APPLICATION_JSON, ACCEPT_OCTET_STREAM, INTERNAL_ERROR, makeHeaders } from "./common";

export enum FetchDirection {
    PREVIOUS = "previous",
    NEXT = "next"
}

export const apiPostRecord = async (place: string, memo: string, latlon: LatLon, address: string, dataURI: string): Promise<null> => {
    try {
        const record: RecordRequest = { place: place, memo: memo, latitude: latlon.latitude, longitude: latlon.longitude, address: address };
        const body = JSON.stringify(record);
        console.log(body);
        const headers = makeHeaders(
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        );
        const res = await fetch(`${baseURL}/record`, { method: "POST", headers: headers, body: body })
        if (res.status != 200) throw { success: false, reason: 'POST /record failed' };

        const data = await res.json();
        const id = data.id;
        const headers2 = makeHeaders(
            {
                'Accept': 'application/json',
                'Content-Type': 'application/octet-stream'
            }
        );
        const blob = await dataURItoBlob(dataURI);
        const res2 = await fetch(
            `${baseURL}/photo/${id}`,
            { method: "POST", headers: headers2, body: blob }
        )
        if (res2.status == 200) {
            return null;
        }
        else {
            throw new Error('POST photo failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiPutRecord = async (id: number, place: string, memo: string): Promise<null> => {
    try {
        const headers = makeHeaders({ 'Content-Type': 'application/json' });
        const body = JSON.stringify({ place: place, memo: memo });
        const res = await fetch(`${baseURL}/record/${id}`, { method: "PUT", headers: headers, body: body });
        if (res.status == 200) {
            return null;
        }
        else {
            throw new Error('PUT record failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiGetRecords = async (limit: number, offset: number): Promise<Array<RecordResponse>> => {
    const headers = makeHeaders({ 'Accept': 'application/json' });
    try {
        const res = await fetch(`${baseURL}/record?limit=${limit}&offset=${offset}`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const records = await res.json();
            return records;
        } else {
            throw new Error('GET records failed');
        }
    } catch (e) {
        throw new Error('get records failed');
    }
}

export const apiGetRecordsOrderByDistance = async (latitude: number, longitude: number, limit: number, offset: number): Promise<Array<RecordResponse>> => {
    const headers = makeHeaders({ 'Accept': 'application/json' });
    try {
        const res = await fetch(`${baseURL}/record?latitude=${latitude}&longitude=${longitude}&limit=${limit}&offset=${offset}`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const records = await res.json();
            return records;
        } else {
            throw new Error('GET records failed');
        }
    } catch (e) {
        throw new Error('get records failed');
    }
}

export const apiGetPhotoAttribute = async (id: number): Promise<PhotoAttribute> => {
    try {
        const res = await fetch(`${baseURL}/photo/${id}/attribute`, { method: "GET", headers: ACCEPT_APPLICATION_JSON });
        if (res.status == 200) {
            return await res.json();
        } else {
            throw new Error('GET photo attribute failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiGetThumbnails = async (rec: Array<RecordResponse>): Promise<Map<string, string>> => {
    try {
        const thumbnails = new Map<string, string>();
        let success: boolean = false;
        await Promise.all(rec.map(async (r: RecordResponse) => {
            if (r.id) {
                const res = await fetch(`${baseURL}/photo/${r.id}/thumbnail`, { method: "GET", headers: ACCEPT_OCTET_STREAM });
                const data = await res.blob();
                thumbnails.set(`id_${r.id}`, URL.createObjectURL(data));
                success = (res.status == 200);
            }
        }));
        if (success) {
            return thumbnails;
        }
        else {
            throw new Error('get thumbnails failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiGetImage = async (id: number): Promise<string> => {
    try {
        const res = await fetch(`${baseURL}/photo/${id}/image`, { method: "GET", headers: ACCEPT_OCTET_STREAM });
        if (res.status == 200) {
            const data = await res.blob();
            const objectURL = URL.createObjectURL(data);
            return objectURL;
        } else {
            throw new Error('GET image failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiDeleteRecords = async (checkedRecords: number[]): Promise<null> => {
    let success = true;
    try {
        await Promise.all(checkedRecords.map(async id => {
            const res = await fetch(`${baseURL}/record/${id}`, { method: "DELETE", headers: ACCEPT_APPLICATION_JSON });
            console.log(`status: ${res.status}`);
            if (res.status != 200) success = false;
        }));
        if (success) {
            return null;
        } else {
            throw new Error('DELETE records failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiGetRecordCount = async (): Promise<number> => {
    try {
        const res = await fetch(`${baseURL}/management/record/count`, { method: "GET", headers: ACCEPT_APPLICATION_JSON });
        if (res.status == 200) {
            const data = await res.json();
            return data.count;
        } else {
            throw new Error('GET record count failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiGetRecordsEveryNth = async (limit: number): Promise<Array<RecordEveryNthResponse>> => {
    const headers = makeHeaders({ 'Accept': 'application/json' });
    try {
        const res = await fetch(`${baseURL}/management/record/everynth?limit=${limit}`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const records = await res.json();
            return records;
        } else {
            throw new Error('GET records every nth failed');
        }
    } catch (e) {
        throw new Error('get records every nth failed');
    }
}

export const apiGetRecordsEveryNthOrderByDistance = async (latitude: number, longitude: number, limit: number): Promise<Array<RecordEveryNthResponse>> => {
    const headers = makeHeaders({ 'Accept': 'application/json' });
    try {
        const res = await fetch(`${baseURL}/management/record/everynth?latitude=${latitude}&longitude=${longitude}&limit=${limit}`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const records = await res.json();
            return records;
        } else {
            throw new Error('GET records every nth failed');
        }
    } catch (e) {
        throw new Error('get records every nth failed');
    }
}



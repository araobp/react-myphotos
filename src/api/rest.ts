import { authHeaders, baseURL } from "../util/auth";
import { RecordResponse } from "./structure";

import { dataURItoArrayBuffer } from "../util/convert";
import { RecordRequest, LatLon } from "./structure";

export type Result = {
    success: boolean;
    reason?: string;
}

export type ResultRecords = {
    success: boolean;
    data: Array<RecordResponse>;
    reason?: string;
}

export type ResultThumbnails = {
    success: boolean;
    data: Map<string, string>
    reason?: string;
}

export type ResultImage = {
    success: boolean;
    data: string;
    reason?: string;
}

const INTERNAL_ERROR: string = 'Internal error';

export const apiPostRecord = async (place: string, memo: string, latlon: LatLon, dataURI: string): Promise<Result> => {
    try {
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
        const res = await fetch(`${baseURL}/record`, { method: "POST", headers: headers, body: body })
        if (res.status != 200) throw { success: false, reason: 'POST /record failed' };

        const data = await res.json();
        const id = data.id;
        const headers2 = {
            ...{
                'Accept': 'application/json',
                'Content-Type': 'application/octet-stream'
            },
            ...authHeaders
        }
        const res2 = await fetch(
            `${baseURL}/photo/${id}`,
            { method: "POST", headers: headers2, body: dataURItoArrayBuffer(dataURI) }
        )
        if (res2.status == 200) {
            return { success: true };
        }
        else {
            throw { success: false, reason: 'POST photo failed' };
        }
    } catch (e) {
        throw { success: false, reason: INTERNAL_ERROR };
    }
}

export const apiPutRecord = async (id: number, place: string, memo: string): Promise<Result> => {
    try {
        const headers = {
            ...{ 'Content-Type': 'application/json' },
            ...authHeaders
        };
        const body = JSON.stringify({ place: place, memo: memo });
        const res = await fetch(`${baseURL}/record/${id}`, { method: "PUT", headers: headers, body: body });
        if (res.status == 200) {
            return { success: true };
        }
        else {
            throw { success: false, reason: 'PUT record failed' };
        }
    } catch (e) {
        throw { success: false, reason: INTERNAL_ERROR };
    }
}

export const apiGetRecords = async (limit: number, offset: number): Promise<ResultRecords> => {
    const headers = {
        ...{ 'Accept': 'application/json' },
        ...authHeaders
    };
    try {
        const res = await fetch(`${baseURL}/record?limit=${limit}&offset=${offset}`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const records = await res.json();
            return { success: true, data: records };
        } else {
            throw { success: false, reason: 'GET records failed' };
        }
    } catch (e) {
        throw new Error('get records failed');
    }
}

export const apiGetThumbnails = async (rec: Array<RecordResponse>): Promise<ResultThumbnails> => {
    try {
        const headers = {
            ...{ 'Accept': 'application/octet-stream' },
            ...authHeaders
        };
        const thumbnails = new Map<string, string>();
        let success: boolean = false;
        await Promise.all(rec.map(async (r: RecordResponse) => {
            if (r.id) {
                const res = await fetch(`${baseURL}/photo/${r.id}/thumbnail`, { method: "GET", headers: headers });
                const data = await res.blob();
                thumbnails.set(`id_${r.id}`, URL.createObjectURL(data));
                success = (res.status == 200);
            }
        }));
        if (success) {
            return { success: true, data: thumbnails };
        }
        else {
            throw { success: false, reason: 'get thumbnails failed' };
        }
    } catch (e) {
        throw { success: false, reason: INTERNAL_ERROR };
    }
}

export const apiGetImage = async (id: number): Promise<ResultImage> => {
    try {
        const headers = {
            ...{ 'Accept': 'application/octet-stream' },
            ...authHeaders
        }
        const res = await fetch(`${baseURL}/photo/${id}/image`, { method: "GET", headers: headers });
        if (res.status == 200) {
            const data = await res.blob();
            const objectURL = URL.createObjectURL(data);
            return { success: true, data: objectURL };
        } else {
            throw { success: false, reason: 'GET image failed' };
        }
    } catch (e) {
        throw { success: false, reason: INTERNAL_ERROR };
    }
}

export const apiDeleteRecords = async (checkedRecords: number[]): Promise<Result> => {
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
        if (success) {
            return {success: true};
        } else {
            return {success: false, reason: 'DELETE records failed'};
        }
    } catch (e) {
        throw {success: false, reason: INTERNAL_ERROR};
    }
}

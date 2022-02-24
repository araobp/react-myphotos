import { authHeaders, baseURL } from "../util/auth";
import { GpsLog, RecordResponse } from "./structure";

import { dataURItoArrayBuffer } from "../util/convert";
import { RecordRequest, LatLon } from "./structure";

export type Result = {
    success: boolean;
    reason?: string;
}

export type ResultRecords = {
    data: Array<RecordResponse>
} & Result;

export type ResultThumbnails = {
    data: Map<string, string>
} & Result;

export type ResultImage = {
    data: string;
} & Result;

export type ResultCount = {
    data: number;
} & Result;

const INTERNAL_ERROR: Result = { success: false, reason: 'Internal error' };

const makeHeaders = (headers: object) => {
    return { ...headers, ...authHeaders };
}

const ACCEPT_APPLICATION_JSON = makeHeaders({ 'Accept': 'application/json' });
const ACCEPT_OCTET_STREAM = makeHeaders({ 'Accept': 'application/octet-stream' });

export const apiPostRecord = async (place: string, memo: string, latlon: LatLon, dataURI: string): Promise<Result> => {
    try {
        const record: RecordRequest = { place: place, memo: memo, latitude: latlon.latitude, longitude: latlon.longitude };
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
        throw INTERNAL_ERROR;
    }
}

export const apiPutRecord = async (id: number, place: string, memo: string): Promise<Result> => {
    try {
        const headers = makeHeaders({ 'Content-Type': 'application/json' });
        const body = JSON.stringify({ place: place, memo: memo });
        const res = await fetch(`${baseURL}/record/${id}`, { method: "PUT", headers: headers, body: body });
        if (res.status == 200) {
            return { success: true };
        }
        else {
            throw { success: false, reason: 'PUT record failed' };
        }
    } catch (e) {
        throw INTERNAL_ERROR;
    }
}

export const apiGetRecords = async (limit: number, offset: number): Promise<ResultRecords> => {
    const headers = makeHeaders({ 'Accept': 'application/json' });
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
            return { success: true, data: thumbnails };
        }
        else {
            throw { success: false, reason: 'get thumbnails failed' };
        }
    } catch (e) {
        throw INTERNAL_ERROR;
    }
}

export const apiGetImage = async (id: number): Promise<ResultImage> => {
    try {
        const res = await fetch(`${baseURL}/photo/${id}/image`, { method: "GET", headers: ACCEPT_OCTET_STREAM });
        if (res.status == 200) {
            const data = await res.blob();
            const objectURL = URL.createObjectURL(data);
            return { success: true, data: objectURL };
        } else {
            throw { success: false, reason: 'GET image failed' };
        }
    } catch (e) {
        throw INTERNAL_ERROR;
    }
}

export const apiDeleteRecords = async (checkedRecords: number[]): Promise<Result> => {
    let success = true;
    try {
        await Promise.all(checkedRecords.map(async id => {
            const res = await fetch(`${baseURL}/record/${id}`, { method: "DELETE", headers: ACCEPT_APPLICATION_JSON });
            console.log(`status: ${res.status}`);
            if (res.status != 200) success = false;
        }));
        if (success) {
            return { success: true };
        } else {
            return { success: false, reason: 'DELETE records failed' };
        }
    } catch (e) {
        throw INTERNAL_ERROR;
    }
}

export const apiGetCount = async (): Promise<ResultCount> => {
    try {
        const res = await fetch(`${baseURL}/management/count`, { method: "GET", headers: ACCEPT_APPLICATION_JSON });
        if (res.status == 200) {
            const data = await res.json();
            return { success: true, data: data.count };
        } else {
            throw { success: false, reason: 'GET count failed' };
        }
    } catch (e) {
        throw INTERNAL_ERROR;
    }
}

export const apiPostGpsLog = async (log: GpsLog): Promise<Result> => {
    try {
        const body = JSON.stringify(log);
        console.log(body);
        const headers = makeHeaders(
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        );
        const res = await fetch(`${baseURL}/gpslog`, { method: "POST", headers: headers, body: body })
        if (res.status == 200) {
            return { success: true };
        } else {
            throw { success: false, reason: 'POST gpslog failed' };
        }
    } catch (e) {
        throw INTERNAL_ERROR;
    }
}


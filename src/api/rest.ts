import { authHeaders, baseURL } from "../util/auth";
import { GpsLog, RecordResponse } from "./structure";

import { dataURItoArrayBuffer } from "../util/convert";
import { RecordRequest, LatLon } from "./structure";

const INTERNAL_ERROR = 'Internal error';

const makeHeaders = (headers: object) => {
    return { ...headers, ...authHeaders };
}

const ACCEPT_APPLICATION_JSON = makeHeaders({ 'Accept': 'application/json' });
const ACCEPT_OCTET_STREAM = makeHeaders({ 'Accept': 'application/octet-stream' });

export const apiPostRecord = async (place: string, memo: string, latlon: LatLon, dataURI: string): Promise<null> => {
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

export const apiGetCount = async (): Promise<number> => {
    try {
        const res = await fetch(`${baseURL}/management/count`, { method: "GET", headers: ACCEPT_APPLICATION_JSON });
        if (res.status == 200) {
            const data = await res.json();
            return data.count;
        } else {
            throw new Error('GET count failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}

export const apiPostGpsLog = async (log: GpsLog): Promise<null> => {
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
            return null;
        } else {
            throw new Error('POST gpslog failed');
        }
    } catch (e) {
        throw new Error(INTERNAL_ERROR);
    }
}


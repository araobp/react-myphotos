export type LatLon = {
    latitude: number;
    longitude: number;
}

/***  Data structures for the REST API ***/
export type RecordRequest = {
    place: string;
    memo: string;
    latitude: number;
    longitude: number;
    address: string;
}

export type RecordResponse = {
    id: number;
    timestamp: string;
    place: string;
    memo: string;
    latitude: number;
    longitude: number;
    address: string;
}

export type RecordEveryNthResponse = {
    id: number;
    timestamp: string;
    place: string;
}

export type Id = {
    id: number
}

export type GpsLogRequest = {
    latitude: number;
    longitude: number;
    session: number | null;
}

export type GpsLogResponse = {
    id: number;
    datetime: string;
    latitude: number;
    longitude: number;
    session: number
}

export type PhotoAttribute = {
    equirectangular: boolean;
}
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
}

export type RecordResponse = {
    id: number;
    datetime: string;
    place: string;
    memo: string;
    latitude: number;
    longitude: number;
}

export type GpsLogRequest = LatLon;

export type GpsLogResponse = {
    id: number;
    datetime: string;
    latitude: number;
    longitude: number;    
}
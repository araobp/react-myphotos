
export type RecordResponse = {
    id: number;
    datetime?: string;
    place: string;
    memo: string;
    latitude: number;
    longitude: number;
}

export type RecordRequest = {
    place: string;
    memo: string;
    latitude: number;
    longitude: number;
}

export type LatLon = {
    latitude: number;
    longitude: number;
}

export type Thumbnails = {
    [key: string]: string
}

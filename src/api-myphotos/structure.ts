export type LatLon = {
    latitude: number;
    longitude: number;
}

/***  Data structures for the REST API ***/
export type RecordRequest = {
    name: string;
    memo__c: string;
    geolocation__latitude__s: number;
    geolocation__longitude__s: number;
    address__c: string;
}

export type RecordResponse = {
    uuid__c: string;
    timestamp__c: string;
    name: string;
    memo__c: string;
    geolocation__latitude__s: number;
    geolocation__longitude__s: number;
    address__c: string;
    distance: number;
}

export type RecordPatchRequest = {
    name: string,
    memo__c: string
}

export type RecordEveryNthResponse = {
    uuid: string;
    timestamp__c: string;
    name: string;
    distance: number;
}

export type Uuid = {
    uuid: string
}

export type PhotoAttribute = {
    equirectangular: boolean;
}
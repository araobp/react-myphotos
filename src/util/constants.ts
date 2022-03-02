import { LatLngExpression } from "leaflet";

export const DEFAULT_LOCATION: LatLngExpression = [35.68124505309657, 139.76713985772236];  // Tokyo station

export const POSTGRES_MAX_INTEGER_VALUE: number = 2147483647;  // 4bytes 

export const RESOLUTION = 0.7;

export const WEBCAM_EABLED = (localStorage.getItem("webcamEnabled") == "true") ? true : false;

import { LatLngExpression } from "leaflet";

export const DEFAULT_LOCATION: LatLngExpression = [35.68124505309657, 139.76713985772236];  // Tokyo station

export const POSTGRES_MAX_INTEGER_VALUE: number = 2147483647;  // 4bytes 

export const PERIOD = parseInt(localStorage.getItem("period") || "0") * 1000;  // msec

export const MOBILE_CAMERA_APP_ENABLED = (localStorage.getItem("mobileCameraAppEnabled") == "true") ? true : false; 

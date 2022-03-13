import { LatLngExpression } from "leaflet";

export const DEFAULT_LOCATION: LatLngExpression = [35.68124505309657, 139.76713985772236];  // Tokyo station

export const LOGIN_NAME: string = localStorage.getItem("login") || "<Unknown>";

export const POSTGRES_MAX_INTEGER_VALUE: number = 2147483647;  // 4bytes 

export const LIMIT: number = parseInt(localStorage.getItem("limit") || "10");

export const RESOLUTION: number = parseFloat(localStorage.getItem("resolution") || "0.6");

export const PANORAMA_FOV = 80;

export const WEBCAM_EABLED = (localStorage.getItem("webcamEnabled") == "true") ? true : false;

export const MOBILE_CAMERA_ENABLED = (localStorage.getItem("mobileCameraEnabled") == "true") ? true : false;

export const FILE_INPUT_ENABLED = (localStorage.getItem("fileInputEnabled") == "true") ? true : false;

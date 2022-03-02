import { Base64 } from 'js-base64';

const login = localStorage.getItem("login") || 'test';
const password = localStorage.getItem("password") || 'passw0rd';
export const authHeaders = {Authorization: `Basic ${Base64.encode(`${login}:${password}`)}`};

export const baseURL = localStorage.getItem("baseURL") || 'http://localhost:3000';

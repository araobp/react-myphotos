import { Base64 } from 'js-base64';

const defaultLogin = localStorage.getItem("login") || 'test';
const defaultPassword = localStorage.getItem("password") || 'passw0rd';

export const authHeaders = {Authorization: `Basic ${Base64.encode(`${defaultLogin}:${defaultPassword}`)}`};

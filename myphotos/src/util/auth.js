import { Base64 } from 'js-base64';

const login = 'test';
const password = 'passw0rd';

export const authHeaders = {Authorization: `Basic ${Base64.encode(`${login}:${password}`)}`};

import { authHeaders } from "./myphotosAuth";

export const INTERNAL_ERROR = 'Internal error';

export const makeHeaders = (headers: object) => {
    return { ...headers, ...authHeaders };
}

export const ACCEPT_APPLICATION_JSON = makeHeaders({ 'Accept': 'application/json' });
export const ACCEPT_OCTET_STREAM = makeHeaders({ 'Accept': 'application/octet-stream' });

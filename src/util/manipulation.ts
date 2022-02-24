const POSTGRES_SQL_MAX_INT_VALUE = 2147483647;
export const LIMIT = 10;

export const backward = (offset: number) => {
    return (offset >= LIMIT) ? offset - LIMIT : offset;
}

export const forward = (offset: number, count: number) => {
    return ((offset + LIMIT) >= count) ? offset : offset + LIMIT;
}

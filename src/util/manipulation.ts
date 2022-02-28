export const LIMIT: number = parseInt(localStorage.getItem("limit") || "10");

export const backward = (offset: number) => {
    return (offset >= LIMIT) ? offset - LIMIT : offset;
}

export const forward = (offset: number, count: number) => {
    return ((offset + LIMIT) >= count) ? offset : offset + LIMIT;
}

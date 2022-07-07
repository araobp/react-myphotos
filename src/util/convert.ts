export const dataURItoBlob = async (dataURI: string) => {
    return await fetch(dataURI).then( r=> r.blob() );
}

export const BlobToDataURI = (blob: Blob) => URL.createObjectURL(blob);

export const LOCALE = 'ja-JP';
export const TIMEZONE_OFFSET = new Date().getTimezoneOffset()/60;

export const toLocalTime = (utcWithoutTZ: string) => {
    const date = new Date(utcWithoutTZ);
    date.setHours(date.getHours() - TIMEZONE_OFFSET);
    return date.toLocaleString(LOCALE);
}
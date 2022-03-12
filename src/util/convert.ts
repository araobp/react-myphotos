export const dataURItoBlob = async (dataURI: string) => {
    return await fetch(dataURI).then( r=> r.blob() );
}

export const BlobToDataURI = (blob: Blob) => URL.createObjectURL(blob);

// Convert UTC to Japan local time
export const toLocalTime = (utc: string) => new Date(utc).toLocaleString('ja-JP');

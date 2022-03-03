import { FC, useEffect, useRef } from "react";

type MobileCameraProps = {
    launch: boolean;
    onPicTaken: (imageURL: string | null) => void;
}

// Use Mobile Camera App on Android/iOS (or read an image file in case of Mac/PC)
export const MobileCamera: FC<MobileCameraProps> = ({ launch, onPicTaken }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
        if (e?.target?.files) {
            const f = e.target.files[0];
            const reader = new FileReader();
            try {
                reader.onload = _ => {
                    onPicTaken(reader.result as string);
                };
                reader.readAsDataURL(f);
            } catch (e) {
                onPicTaken(null);
            }
        } else {
            onPicTaken(null);
        }
    }

    // This is to hide a "choose file" button in a HTML input element, and to lauch 
    // a mobile camera app automatically without pressing a choose file button.
    useEffect(() => {
        console.log(launch);
        if (launch) {
            inputRef?.current?.click();
        }
    }, [launch]);

    return (
        <>
            {/* Note: "capture" is ignored in case of Mac or PC */}
            <input style={{ display: "none" }}
                type="file"
                name="imageFile"
                className="input-file"
                accept="image/*"
                capture="environment"
                ref={inputRef}
                onChange={e => handleChange(e)}
                onClick={e => handleChange(null)}
            />
        </>
    );
}
import { FC, useLayoutEffect, useRef } from "react";

type MobileCameraProps = {
    launch: boolean;
    onPicTaken: (imageURL: string | null) => void;
}

// Use Mobile Camera App on Android/iOS
export const MobileCameraComp: FC<MobileCameraProps> = ({ launch, onPicTaken }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
        if (e?.target?.files) {
            const f = e.target.files[0];
            const reader = new FileReader();
            reader.onload = _ => {
                onPicTaken(reader.result as string);
            };
            reader.readAsDataURL(f);
        } else {
            onPicTaken(null);
        }
    }

    // Note: useEffect() does not work in Safari.
    // [Reference] https://stackoverflow.com/questions/66783577/inputfile-current-click-inside-useeffect-doesnt-work-in-safari
    useLayoutEffect(() => {
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
                onClick={e=> handleChange(null)}
            />
        </>
    );
};
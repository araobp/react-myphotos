import { FC, memo, useEffect, useRef } from "react";

type MobileCameraProps = {
    launch: boolean;
    onPicTaken: (imageURL: string | null) => void;
}

// Use Mobile Camera App on Android/iOS
export const MobileCameraComp: FC<MobileCameraProps> = memo(({ launch, onPicTaken }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
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

    useEffect(() => {
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
            />
        </>
    );
});
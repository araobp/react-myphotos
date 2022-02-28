import { FC } from "react";

export type MobileCameraAppProps = {
    isOpen: boolean;
    setDataURI: (dataURI: string) => void;
}

export const MobileCameraApp: FC<MobileCameraAppProps> = ({ isOpen, setDataURI }) => {

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const file = e.target.files[0];
            const dataURL = URL.createObjectURL(file);
            setDataURI(dataURL);
        }
    }

    return (
        <>
            {isOpen &&
                <input
                    style={{ display: "none" }}
                    accept="image/*"
                    type="file"
                    capture="environment"
                    onChange={(e) => handleCapture(e)}
                />
            }
        </>
    );
}
import { FC } from "react";
import '../App.css';

type FileInputCompProps = {
    onPicTaken: (imageURL: string | null) => void;
}

export const FileInputComp: FC<FileInputCompProps> = ({ onPicTaken }) => {

    const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <input
            type="file"
            name="imageFile"
            className="input-file"
            accept="image/*"
            onChange={e => onFileChanged(e)}
        />
    );
}

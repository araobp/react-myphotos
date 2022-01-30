import React, { useState } from "react";
import { CameraComp } from './CameraComp';
import '../App.css';

export const Upload = () => {

    const [place, setPlace] = useState();
    const [memo, setMemo] = useState();
    const [imageFile, setImageFile] = useState();
    const [showInputFileFlag, setShowInputFileFloag] = useState(false);
    const [showCameraFlag, setShowCameraFlag] = useState(true);
    const [dataURL, setDataURL] = useState();

    const postRecord = e => {

    }
    /*
    const postRecord = e => {
        e.preventDefault();

        // POST /records
        const body = JSON.stringify({ place: params.place, memo: params.memo });
        const method = "POST";
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch(`${process.env.BASE_URL}/records`, { method: method, headers: headers, body: body })
            .then(res => res.json())
            .then(body => {
                const id = body.id;
                const method = "POST";
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/octet-stream'
                }
                fetch(`${process.env.BASE_URL}/photos/${id}`, { method: method, headers: headers, body: imageFile })
                    .then(res => {
                        console.log(res.status);
                    });
            });
    }
    */

    const handleChange = f => {
        setImageFile(f);
        const reader = new FileReader();
        reader.onload = e => {
            setDataURL(reader.result);
        };
        reader.readAsDataURL(f);
    }

    console.log('Upload');

    return (
        <div>
            <form onSubmit={postRecord}>

                <div>
                    <label>Place:
                        <input
                            type="text"
                            name="place"
                            value={place || ""}
                            onChange={e => setPlace(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>Memo:
                        <input
                            type="text"
                            name="memo"
                            value={memo || ""}
                            onChange={e => setMemo(e.target.value)}
                        />
                    </label>
                </div>

                {showInputFileFlag &&
                    <div>
                        <label>Image file:
                            <input
                                type="file"
                                name="imageFile"
                                //value={params.imageFile || ""}
                                onChange={e => handleChange(e.target.files[0])}
                            />
                        </label>
                    </div>
                }

                <img src={dataURL} width="30%"/>

                <button className="small-button" type="submit">Upload</button>

                <button className="small-button" type="submit" onClick={() => setShowCameraFlag(true)}>Camera</button>
            </form>
            {showCameraFlag &&
                <CameraComp dataURL={dataURL} setDataURL={setDataURL} setShowCameraFlag={setShowCameraFlag} />
            }
        </div>
    );
};

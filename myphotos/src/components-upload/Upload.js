import React, { useState } from "react";
import { CameraComp } from './CameraComp';
import '../App.css';
import { dataURItoArrayBuffer } from '../util/convert';
import { GeoLocation } from '../components-common/GeoLocation';
import Modal from "react-modal";
import { styleModal } from "../components-common/styles";

export const Upload = ({ location }) => {

    Modal.setAppElement("#root");

    const [place, setPlace] = useState();
    const [memo, setMemo] = useState();
    //const [imageFile, setImageFile] = useState();
    const [showInputFileFlag, setShowInputFileFlag] = useState();
    const [showCameraFlag, setShowCameraFlag] = useState(false);
    const [dataURI, setDataURI] = useState();
    const [showMap, setShowMap] = useState();

    const postRecord = e => {
        e.preventDefault();

        // POST /records
        const obj = { place: place, memo: memo };
        if (location) {
            obj.latitude = location.latitude;
            obj.longitude = location.longitude;
        } else {
            obj.latitude = 0.0;
            obj.longitude = 0.0;
        }
        const body = JSON.stringify(obj);
        console.log(body);
        const method = "POST";
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch(`${process.env.REACT_APP_BASE_URL}/records`, { method: method, headers: headers, body: body })
            .then(res => res.json())
            .then(body => {
                const id = body.id;
                const method = "POST";
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/octet-stream'
                }
                fetch(
                    `${process.env.REACT_APP_BASE_URL}/photos/${id}`,
                    { method: method, headers: headers, body: dataURItoArrayBuffer(dataURI) }
                )
                    .then(res => {
                        console.log(res.status);
                    });
            });
    }

    const handleChange = f => {
        const reader = new FileReader();
        reader.onload = e => {
            setDataURI(reader.result);
        };
        reader.readAsDataURL(f);
    }

    console.log(showCameraFlag);

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
            </form>

            <img src={dataURI} width="30%" />

            <div>
                <button className="small-button" type="submit" onClick={() => setShowMap(true)}>Show Map</button>
                <button className="small-button" type="submit" onClick={postRecord}>Upload</button>
                <button className="small-button" type="submit" onClick={() => setShowInputFileFlag(true)}>File</button>
                <button className="small-button" type="submit" onClick={() => setShowCameraFlag(true)}>Camera</button>
            </div>

            {showCameraFlag &&
                <CameraComp dataURI={dataURI} setDataURI={setDataURI} setShowCameraFlag={setShowCameraFlag} />
            }

            {location && showMap &&
                <Modal isOpen={showMap} style={styleModal} >
                    <div>
                        <GeoLocation latitude={location.latitude} longitude={location.longitude} />
                        <button className="small-button" onClick={() => setShowMap(false)}>Close</button>
                    </div>
                </Modal>
            }
        </div >
    );
};

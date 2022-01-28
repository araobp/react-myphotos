import React, {useState} from "react";
import '../App.css';

const Upload = ({ BASE_URL, imageFile, setImageFile }) => {

    const [params, setParams] = useState({});

    const postRecord = e => {
        e.preventDefault();

        // POST /records
        const body = JSON.stringify({ place: params.place, memo: params.memo });
        const method = "POST";
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch(`${BASE_URL}/records`, { method: method, headers: headers, body: body })
            .then(res => res.json())
            .then(body => {
                const id = body.id;
                const method = "POST";
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/octet-stream'
                }
                fetch(`${BASE_URL}/photos/${id}`, { method: method, headers: headers, body: imageFile })
                    .then(res => {
                        console.log(res.status);
                    });
            });
    }

    const handleChange = e => {
        setParams(recordInput => ({...recordInput, [e.target.name]: e.target.value}));
        console.log(params);
    }

    const handleImageFile = file => {
        const reader = new FileReader();
        reader.onload = e => {
            setImageFile(e.target.result);
        }
        reader.readAsArrayBuffer(file);
    }
    
    return (
        <form onSubmit={postRecord}>

            <div>
            <label>Place:
                <input
                    type="text"
                    name="place"
                    value={params.place || ""}
                    onChange={handleChange}
                />
            </label>
            </div>

            <div>
            <label>Memo:
                <input
                    type="text"
                    name="memo"
                    value={params.memo || ""}
                    onChange={handleChange}
                />
            </label>
            </div>

            <div>
            <label>Image file:
                <input
                    type="file"
                    name="imageFile"
                    onChange={e => handleImageFile(e.target.files[0])}
                />
            </label>
            </div>

            <button className="small-button" type="submit">Upload</button>

        </form>
    );
};

export default Upload;
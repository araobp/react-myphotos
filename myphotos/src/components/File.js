import React from "react";

const Form = ({ recordInput, setRecordInput, setImageFile, postRecord }) => {

    const handleChange = e => {
        setRecordInput(recordInput => ({...recordInput, [e.target.name]: e.target.value}));
        console.log(recordInput);
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
                    value={recordInput.place || ""}
                    onChange={handleChange}
                />
            </label>
            </div>

            <div>
            <label>Memo:
                <input
                    type="text"
                    name="memo"
                    value={recordInput.memo || ""}
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

            <button type="submit">Upload</button>

        </form>
    );
};

export default Form;
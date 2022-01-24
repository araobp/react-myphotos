import React from "react";

const Form = ({ recordInput, setRecordInput, postRecord }) => {

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setRecordInput(values => ({...values, [name]: value}));
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
                    value={recordInput.imageFile || ""}
                    onChange={handleChange}
                />
            </label>
            </div>

            <button type="submit">Upload</button>

        </form>
    );
};

export default Form;
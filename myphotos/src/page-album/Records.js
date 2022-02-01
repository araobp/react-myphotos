import '../App.css';
import { styleModal } from "../components-common/styles";
import { useState } from "react";
import { GeoLocation } from '../components-common/GeoLocation';
import Modal from "react-modal";

export const Records = ({ records, getRecords, checkedRecords, handleCheckedRecord, deleteCheckedRecords }) => {

    const [showImage, setShowImage] = useState(false);
    const [imageURL, setImageURL] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState({});

    Modal.setAppElement("#root");

    const openImage = (id) => {
        setImageURL(`${process.env.REACT_APP_BASE_URL}/photos/${id}/image`);
        setShowImage(true);
    }

    const openMap = (latitude, longitude) => {
        setLocation({ latitude: latitude, longitude: longitude });
        setShowMap(true);
    }

    return (
        <div>
            <Modal isOpen={showImage} style={styleModal}>
                <img src={imageURL} className="content" />
                <button className="small-button" onClick={() => setShowImage(false)}>Close</button>
            </Modal>
            <Modal isOpen={showMap} style={styleModal}>
                <GeoLocation latitude={location.latitude} longitude={location.longitude} />
                <button className="small-button" onClick={() => setShowMap(false)}>Close</button>
            </Modal>
            <div>
                <form onSubmit={getRecords}>
                    <button className="small-button" type="submit">Refresh</button>
                </form>
                <form onSubmit={deleteCheckedRecords}>
                    <button className="small-button" type="submit">Delete</button>
                </form>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>id</th>
                        <th>datetime</th>
                        <th>place</th>
                        <th>memo</th>
                        <th>map</th>
                        <th>thumbnail</th>
                    </tr>
                </thead>
                {records.map((r, index) => (
                    <tbody key={r.id}>
                        <tr>
                            <td><input type="checkbox" defaultChecked={(checkedRecords.indexOf(r.id) == -1) ? false : true} onChange={(e) => handleCheckedRecord(r.id, e.target.checked)} /></td>
                            <td>{r.id}</td>
                            <td>{new Date(r.record.datetime).toLocaleString()}</td>
                            <td>{r.record.place}</td>
                            <td>{r.record.memo}</td>
                            <td><button onClick={() => openMap(r.record.latitude, r.record.longitude)}>Map</button></td>
                            <td><img src={`${process.env.REACT_APP_BASE_URL}/photos/${r.id}/thumbnail`} onClick={() => openImage(r.id)} /></td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    );
}

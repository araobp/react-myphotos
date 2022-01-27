const Records = ({ BASE_URL, records, setModalOpen, setImageUrl, checkedRecords, handleCheckedRecord, deleteCheckedRecords }) => {

    const openModal = (id) => {
        setImageUrl(`${BASE_URL}/photos/${id}/image`);
        setModalOpen(true);
    }

    return (
        <div>
            <form onSubmit={deleteCheckedRecords}>
                <button type="submit">Delete checked records</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>id</th>
                        <th>datetime</th>
                        <th>place</th>
                        <th>memo</th>
                        <th>thumbnail</th>
                    </tr>
                </thead>
                {records.map((r, index) => (
                    <tbody key={r.id}>
                        <tr>
                            <td><input type="checkbox" defaultChecked={(checkedRecords.indexOf(r.id) == -1)? false: true} onChange = {(e) => handleCheckedRecord(r.id, e.target.checked)} /></td>
                            <td>{r.id}</td>
                            <td>{new Date(r.record.datetime).toLocaleString()}</td>
                            <td>{r.record.place}</td>
                            <td>{r.record.memo}</td>
                            <td><img src={`${BASE_URL}/photos/${r.id}/thumbnail`} onClick={() => openModal(r.id)} /></td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    );
}

export default Records;
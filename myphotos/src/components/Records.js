const Records = ({ BASE_URL, records, setModalOpen, setImageUrl}) => {

    const openModal = (id) => {
        setImageUrl(`${BASE_URL}/photos/${id}/image`);
        setModalOpen(true);
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>datetime</th>
                        <th>place</th>
                        <th>memo</th>
                        <th>thumbnail</th>
                    </tr>
                </thead>
                {records.map((r, i) => (
                    <tbody key={i}>
                        <tr>
                            <td>{r.id}</td>
                            <td>{new Date(r.record.datetime).toLocaleString()}</td>
                            <td>{r.record.place}</td>
                            <td>{r.record.memo}</td>
                            <td><img src={`${BASE_URL}/photos/${r.id}/thumbnail`} onClick={() => openModal(r.id)}/></td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    );
}

export default Records;
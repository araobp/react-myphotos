const Records = ({ BASE_URL, records}) => {
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
                            <td><a href={`${BASE_URL}/photos/${r.id}/image`} target="_blank"><img src={`${BASE_URL}/photos/${r.id}/thumbnail`}/></a></td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    );
}

export default Records;
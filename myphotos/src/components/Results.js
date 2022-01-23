const Results = ({ records }) => {
    return (
        <div>
            <table>
                <tr>
                    <th>id</th>
                    <th>datetime</th>
                    <th>place</th>
                    <th>memo</th>
                </tr>
                {records.map((r, i) => (
                    <tr>
                        <td>{r.id}</td>
                        <td>{new Date(r.record.datetime).toLocaleString()}</td>
                        <td>{r.record.place}</td>
                        <td>{r.record.memo}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default Results;
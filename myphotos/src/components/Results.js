const Results = ({ records }) => {
    return (
        <div>
            <table>
                <tr>
                    <th>datetime</th>
                    <th>place</th>
                    <th>memo</th>
                    <th>format</th>
                </tr>
                {records.map((r, i) => (
                    <tr>
                        <td>{r.datetime}</td>
                        <td>{r.place}</td>
                        <td>{r.memo}</td>
                        <td>{r.format}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default Results;
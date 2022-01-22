const Results = ({ records }) => {
    return (
        <div>
            <table>
                <tr>
                    <th>datetime</th>
                    <th>place</th>
                    <th>memo</th>
                </tr>
                {records.map((r, i) => (
                    <tr>
                        <td>{r.datetime}</td>
                        <td>{r.place}</td>
                        <td>{r.memo}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default Results;
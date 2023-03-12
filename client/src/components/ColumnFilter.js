export const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter} = column
    return (
        <span>
            {/* Search Ticket: {' '} */}
            <input className="m-5" size="25" value={filterValue || ''}
            onChange={e => setFilter(e.target
                .value)} />
                
        </span>
    )
}
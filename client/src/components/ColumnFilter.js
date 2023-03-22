export const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter} = column
    return (
        <span>
            {/* Search Ticket: {' '} */}
            <input className="m-5 filter"  value={filterValue || ''}
            onChange={e => setFilter(e.target
                .value)} />
                
        </span>
    )
}
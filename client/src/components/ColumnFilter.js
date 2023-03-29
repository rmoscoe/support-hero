export const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column
    return (
            <div style={{ position: 'relative', marginTop: '10px'}}>
                <input
                    className="filter"
                    value={filterValue || ''}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ paddingLeft: '30px' }}
                />
                <i
                    className="light-text fa fa-filter"
                    aria-hidden="true"
                />
            </div>

    
    )
}
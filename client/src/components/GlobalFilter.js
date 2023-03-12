import React from 'react';

export const GlobalFilter = ({ filter,setFilter}) => {
    return (
        <span>
            Search Ticket: {' '}
            <input className="m-5" size="50" value={filter || ''}
            onChange={e => setFilter(e.target
                .value)} />
                
        </span>
    )
}
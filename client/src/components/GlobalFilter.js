import React from 'react';
import { useTheme } from '../utils/ThemeContext';

export const GlobalFilter = ({ filter,setFilter}) => {
    const { theme} = useTheme();
    return (
        <span>
            <strong  className={theme}>Search Ticket: </strong>{' '}
            <input className="m-5" size="50" value={filter || ''}
            onChange={e => setFilter(e.target
                .value)} />
                
        </span>
    )
}


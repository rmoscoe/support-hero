import React from 'react';
import { useTheme } from '../utils/ThemeContext';

export const GlobalFilter = ({ filter, setFilter }) => {
    const { theme } = useTheme();
    return (
        <span >
            <strong className={`header ${theme}-text`}>Search Ticket: </strong>{' '}
            <input className="body m-5" size="50" value={filter || ''}
                onChange={e => setFilter(e.target
                    .value)} />

        </span>
    )
}


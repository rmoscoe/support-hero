import React from 'react';
import { useTheme } from '../utils/ThemeContext';


function TimeInQueue({ metrics }) {
    const { theme } = useTheme();
console.log(metrics)
    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
    let date = Date.parse(metrics?.getTicketsByUserId[i].createdAt);
    console.log(date);
    };
    

    return (
        <>
            <div className={`${theme}-secondary-bg card is-flex-grow-1`} style={{ minWidth: '300px', minHeight: '300px' }} >
                <div className={`card-header `}>
                    <h2 className={`${theme}-tertiary is-size-4 card-header-title is-centered`}>Time In Queue</h2>
                </div>
               
                <p className='card-content'></p>
            </div>

        </>

    )
};

export default TimeInQueue;
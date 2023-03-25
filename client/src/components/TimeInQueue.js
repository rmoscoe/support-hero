import React from 'react';
import { useTheme } from '../utils/ThemeContext';

function TimeInQueue({ metrics }) {
    const { theme } = useTheme();
    // calculate average time between when ticket is created to when ticket is closed
    let total = 0;
    let closeCount = 0;
    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        let createdAt = new Date(metrics?.getTicketsByUserId[i].createdAt);
        let closedAt = new Date(metrics?.getTicketsByUserId[i].closedAt);
        let timeInQueue = (closedAt - createdAt) / 86400000; //days
        if(metrics?.getTicketsByUserId[i].status === 'Closed')closeCount++;
        total += isNaN(timeInQueue) ? 0 : timeInQueue;
    }
    let average = total / closeCount;
    // formats average in day/hour/minute/second format
    function formatTime(time) {
        const days = Math.floor(time);
        const hours = Math.floor((time - days) * 24);
        const minutes = Math.floor(((time - days) * 24 - hours) * 60);
        const seconds = Math.floor((((time - days) * 24 - hours) * 60 - minutes) * 60);

        const timeArr = [];
        if (days > 0) timeArr.push(`${days} Day${days > 1 ? 's' : ''}`);
        if (hours > 0) timeArr.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) timeArr.push(`${minutes} Minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0) timeArr.push(`${seconds} Second${seconds > 1 ? 's' : ''}`);

        return timeArr;
    }

    return (
        <>
            <div className={`${theme}-secondary-bg card is-flex-grow-1`} style={{ minWidth: '300px', minHeight: '300px' }} >
            <div className={`message-header ${theme}-tertiary`}>
                <p className='description'>Time in Queue</p>
            </div>
                {formatTime(average).map((time, i) => (
                    <p className='time card-content' key={i}>{time}</p>
                ))}
            </div>

        </>

    )
};

export default TimeInQueue;
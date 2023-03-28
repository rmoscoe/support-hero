import React from 'react';
import { useTheme } from '../utils/ThemeContext';

function ResolutionTime({ metrics }) {
    const { theme } = useTheme();
    console.log('metrics:', metrics)
    // calculate average time between when ticket is created to when ticket is closed
    let total = 0;
    let closeCount = 0;

    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        let createdAt = new Date(metrics?.getTicketsByUserId[i].createdAt);
        let closedAt = new Date(metrics?.getTicketsByUserId[i].closedAt);
        let timeInQueue = (closedAt - createdAt) / 86400000; //days
        if (metrics?.getTicketsByUserId[i].status === 'Closed') closeCount++;
        total += isNaN(timeInQueue) ? 0 : timeInQueue;
        console.log('total:', total)
    }

    let average = total / closeCount;
    console.log('average:', average)
    // formats average in day/hour/minute/second format
    function formatTime(time) {
        const days = Math.floor(time);
        const hours = Math.floor((time - days) * 24);
        const minutes = Math.floor(((time - days) * 24 - hours) * 60);

        const timeArr = [];
        if (days > 0) timeArr.push(`${days} Day${days > 1 ? 's' : ''}`);
        if (hours > 0) timeArr.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) timeArr.push(`${minutes} Minute${minutes > 1 ? 's' : ''}`);
        console.log('timeArr:', timeArr)
        return timeArr;
    }

    function checkData(metrics) {
        for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
            if (metrics?.getTicketsByUserId[i].closedAt === 'Invalid Date') {
                console.log('check data returned true')
                return true
            }
            console.log('check data returned false')
            return false;
        };
    };

    return (
        <>
            <div className={`metric-card ${theme}-secondary-bg card is-flex-grow-1`} style={{ border: '3px solid black', borderRadius: '8px' }} >
                <div className={`message-header ${theme}-quaternary`}>
                    <p className={`${theme}-text header description`}>Average Resolution Time</p>
                </div>
                {checkData(metrics) ?
                    <div className='time-metric' >
                        {formatTime(average).map((time, i) => (
                            <div key={i}>
                                <p key={i}>{time.split(' ')[0]}</p>
                                <p key={i + 1}>{time.split(' ')[1]}</p>
                            </div>
                        ))}
                    </div>
                    : <p className='body'>No Data Available in Table</p>}
            </div>
        </>

    )
};

export default ResolutionTime;
import React from 'react';
import { useTheme } from '../utils/ThemeContext';


function ResponseTime({ metrics }) {
    const { theme } = useTheme();

    // calculate average time between when a customer sends a message and when agent responds
    let total = 0;
    let responseCount = 0;

    // iterate through tickets
    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        // if there's only 1 message, no response time
        if (metrics?.getTicketsByUserId[i].comments.length > 1) {
            // iterate through comments on ticket
            for (let j = 1; j < metrics?.getTicketsByUserId[i].comments.length; j++) {
                // Response counts as customer message that preceeds an agent message
                if (metrics?.getTicketsByUserId[i].comments[j].creator.type === "Agent" && metrics?.getTicketsByUserId[i].comments[j - 1].creator.type === "Customer") {
                    let customerMsg = new Date(metrics?.getTicketsByUserId[i].comments[j - 1].createdAt);
                    let agentResponse = new Date(metrics?.getTicketsByUserId[i].comments[j].createdAt);
                    let responseTime = (agentResponse - customerMsg) / 86400000; //days
                    total += responseTime;
                    responseCount++;
                }
            }
        }
    }
    let average = total / responseCount;

    // formats average in day/hour/minute/second format
    function formatTime(time) {
        const days = Math.floor(time);
        const hours = Math.floor((time - days) * 24);
        const minutes = Math.floor(((time - days) * 24 - hours) * 60);

        const timeArr = [];
        if (days > 0) timeArr.push(`${days} Day${days > 1 ? 's' : ''}`);
        if (hours > 0) timeArr.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) timeArr.push(`${minutes} Minute${minutes > 1 ? 's' : ''}`);
        return timeArr;
    }

    return (
        <>
            <div className={`metric-card ${theme}-secondary-bg card is-flex-grow-1`} style={{ border: '3px solid black', borderRadius: '8px' }} >
                <div className={`message-header ${theme}-tertiary`}>
                    <p className={`${theme}-text header description`}>Average Response Time</p>
                </div>
                {responseCount >= 1 ?
                    <div className='time-metric'>
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

export default ResponseTime;
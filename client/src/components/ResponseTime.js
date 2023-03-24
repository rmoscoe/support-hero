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
                if(metrics?.getTicketsByUserId[i].comments[j].creator.type === "Agent" && metrics?.getTicketsByUserId[i].comments[j - 1].creator.type === "Customer"){
                    let customerMsg = new Date(metrics?.getTicketsByUserId[i].comments[j - 1].createdAt);
                    let agentResponse = new Date(metrics?.getTicketsByUserId[i].comments[j].createdAt);
                    let responseTime = (agentResponse - customerMsg) / 86400000; //days
                    total += responseTime;
                    responseCount++;
                }
            }
        }
    }
    let average = total/responseCount;
    
    // formats average in day/hour/minute/second format
    function formatTime(time) {
        if (average > 1) {
            let days = Math.floor(average)
            let hours = (average - days) * 24;
            if (hours > 1) {
                let newHours = Math.floor(hours);
                let minutes = (hours - newHours) * 60;
                if (minutes > 1) {
                    let newMin = Math.floor(minutes);
                    let seconds = Math.floor((minutes - newMin) * 60);
                    return(`Days: ${days}, Hours: ${newHours}, Minutes: ${newMin}, Seconds: ${seconds}`);
                }
            }
        } else {
            let hours = average * 24;
            if (hours > 1) {
                let newHours = Math.floor(hours);
                let minutes = (hours - newHours) * 60;
                if (minutes > 1) {
                    let newMin = Math.floor(minutes);
                    let seconds = Math.floor((minutes - newMin) * 60);
                    return(`Hours: ${newHours}, Minutes: ${newMin}, Seconds: ${seconds}`);
                }
            } else {
                let minutes = hours * 60;
                if (minutes > 1) {
                    let newMin = Math.floor(minutes);
                    let seconds = Math.floor((minutes - newMin) * 60);
                    return(`Minutes: ${newMin}, Seconds: ${seconds}`);
                }
            }
        }
    }

    return (
        <>
            <div className={`${theme}-secondary-bg card is-flex-grow-1`} style={{ minWidth: '300px', minHeight: '300px' }} >
                <div className={`card-header `}>
                    <h2 className={`${theme}-tertiary is-size-4 card-header-title is-centered`}>Response Time</h2>
                </div>

                <p className='card-content'>{formatTime(average)}</p>
            </div>

        </>

    )
};

export default ResponseTime;
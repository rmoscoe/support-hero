import React from 'react';
import { useTheme } from '../utils/ThemeContext';

function TimeInQueue({ metrics }) {
    const { theme } = useTheme();

    // calculate average time between when ticket is created to when ticket is closed
    let total = 0;
    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        let createdAt = new Date(metrics?.getTicketsByUserId[i].createdAt);
        let closedAt = new Date(metrics?.getTicketsByUserId[i].closedAt);
        let timeInQueue = (closedAt - createdAt) / 86400000; //days
        total += isNaN(timeInQueue) ? 0 : timeInQueue;
    }
    let average = total / metrics.getTicketsByUserId.length;

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
                    <h2 className={`${theme}-tertiary is-size-4 card-header-title is-centered`}>Average Time In Queue</h2>
                </div>
                <p className='card-content'>{formatTime(average)}</p>
            </div>

        </>

    )
};

export default TimeInQueue;
import React from 'react';
import { useTheme } from '../utils/ThemeContext';
import BarChart from './BarChart';

function FeedbackScores({ metrics }) {
    const { theme } = useTheme();
    let obj = [
        { rating: 'Very Satisfied', count: 0 },
        { rating: 'Satisfied', count: 0 },
        { rating: 'Neutral', count: 0 },
        { rating: 'Dissatisfied', count: 0 },
        { rating: 'Very Dissatisfied', count: 0 }];

    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        if (metrics?.getTicketsByUserId[i].feedback) {
            // feedbackCount++
            let rating = metrics?.getTicketsByUserId[i].feedback.rating
            for (let j = 0; j < obj.length; j++) {
                if (obj[j].rating === rating) {
                    obj[j].count = obj[j].count + 1
                }
            }
        }
    };

    function checkData(obj) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].count > 0) {
                return true
            }
            return false;
        };
    };

    return (
        <>
            <div className={`metric-card ${theme}-secondary-bg card is-flex-grow-1`} style={{ border: '1px solid black'}} >
            <div className={`message-header ${theme}-primary`}>
                <p className='header description'>Feedback Scores</p>
            </div>
                {checkData(obj) ?
                    <BarChart data={obj} />
                    : <p className='body'>No Data Available in Table</p>}
            </div>

        </>

    )
};

export default FeedbackScores;
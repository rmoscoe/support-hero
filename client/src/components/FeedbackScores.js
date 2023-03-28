import React from 'react';
import { useTheme } from '../utils/ThemeContext';
import BarChart from './BarChart';

function FeedbackScores({ metrics }) {
    const { theme } = useTheme();
    let feedbackData = [
        { rating: 'Very Satisfied', count: 0 },
        { rating: 'Satisfied', count: 0 },
        { rating: 'Neutral', count: 0 },
        { rating: 'Dissatisfied', count: 0 },
        { rating: 'Very Dissatisfied', count: 0 }];

    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        if (metrics?.getTicketsByUserId[i].feedback) {
            // feedbackCount++
            let rating = metrics?.getTicketsByUserId[i].feedback.rating
            for (let j = 0; j < feedbackData.length; j++) {
                if (feedbackData[j].rating === rating) {
                    feedbackData[j].count = feedbackData[j].count + 1
                }
            }
        }
    };

    function checkData(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].count > 0) {
                return true
            }
            return false;
        };
    };

    return (
        <>
            <div className={`metric-card ${theme}-secondary-bg card is-flex-grow-1`} style={{ border: '3px solid black', borderRadius: '8px'}} >
            <div style={{border: 'none'}} className={`message-header ${theme}-primary ${theme}-border`}>
                <p className={`${theme}-text header description`}>Feedback Scores</p>
            </div>
                {checkData(feedbackData) ?
                    <BarChart data={feedbackData} />
                    : <p className='body'>No Data Available in Table</p>}
            </div>

        </>

    )
};

export default FeedbackScores;
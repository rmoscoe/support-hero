import React from 'react';
import { useTheme } from '../utils/ThemeContext';


function FeedbackScores({ metrics }) {
    const { theme } = useTheme();


    return (
        <>
            <div className={`${theme}-secondary-bg card is-flex-grow-1`} style={{ minWidth: '300px', minHeight: '300px' }} >
                <div className={`card-header `}>
                    <h2 className={`${theme}-tertiary is-size-4 card-header-title is-centered`}>Feedback Scores</h2>
                </div>
               
                <p className='card-content'></p>
            </div>

        </>

    )
};

export default FeedbackScores;
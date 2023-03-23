import React from 'react';
import { useTheme } from '../utils/ThemeContext';


function IssueType({ metrics }) {
    const { theme } = useTheme();

    let obj = { 'Technical': 0, 'Account-related': 0, 'Bug Report': 0, 'Feature Request': 0 };
    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        obj[metrics?.getTicketsByUserId[i].issueType]++
    };

    return (
        <>
            <div className={`${theme}-secondary-bg card is-flex-grow-1`} style={{ minWidth: '300px', minHeight: '300px' }} >
                <div className={`card-header `}>
                    <h2 className={`${theme}-tertiary is-size-4 card-header-title is-centered`}>Issue Type Frequency</h2>
                </div>
                {Object.keys(obj).map((data) => (
                    <React.Fragment key={data}>
                        <h3>{data}</h3>
                        <p>{obj[data]}</p>
                    </React.Fragment>
                ))}
                <p className='card-content'></p>
            </div>

        </>

    )
};

export default IssueType;
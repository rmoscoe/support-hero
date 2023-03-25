import React from 'react';
import { useTheme } from '../utils/ThemeContext';
import BarChart from './BarChart';


function IssueType({ metrics }) {
    const { theme } = useTheme();

    let obj = [{ issue: 'Technical', count: 0 },
    { issue: 'Account-related', count: 0 }, { issue: 'Bug Report', count: 0 }, { issue: 'Feature Request', count: 0 }];
    for (let i = 0; i < metrics?.getTicketsByUserId.length; i++) {
        if (metrics?.getTicketsByUserId[i].issueType) {
            let issue = metrics?.getTicketsByUserId[i].issueType
            for (let j = 0; j < obj.length; j++) {
                if (obj[j].issue === issue) {
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
            <div className={`${theme}-secondary-bg card is-flex-grow-1`} style={{ minWidth: '300px', minHeight: '300px' }} >
                <div className={`card-header `}>
                    <h2 className={`${theme}-tertiary is-size-4 card-header-title is-centered`}>Issue Type Frequency</h2>
                </div>
                {checkData(obj) ?
                    <BarChart data={obj} />
                    : <p>No Data Available in Table</p>}
                <p className='no-data card-content'></p>
            </div>

        </>

    )
};

export default IssueType;
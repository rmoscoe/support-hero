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
            <div className={`metric-card ${theme}-secondary-bg card is-flex-grow-1`} style={{ border: '3px solid black', borderRadius: '8px'}} >
                <div className={`message-header ${theme}-secondary`}>
                    <p className={`${theme}-text header description`}>Issue Type Frequency</p>
                </div>
                {checkData(obj) ?
                    <BarChart data={obj} />
                    : <p className='body'>No Data Available in Table</p>}
            </div>

        </>

    )
};

export default IssueType;
import React from 'react';
import { useTheme } from '../utils/ThemeContext';
import Auth from '../utils/auth';
import { Navigate } from 'react-router-dom';
import MetricCards from '../components/MetricCards';

function Metrics() {
    const { theme } = useTheme();

    if (!Auth.loggedIn()) {
            return (<Navigate to="/login" />)
    };

    let metrics = [
        {title: "Response Time", content: 45},
        {title: "Time in Queue", content: 45},
        {title: "Feedback Scores", content: "4/5 Stars"},
        {title: "Issue Type Frequency", content: "Information on Issue Type"}
    ];

    return (
        <>
            <h2 className={`${theme} is-block title has-text-centered`}> My Metrics</h2>
            <div className={`container is-flex  is-flex-wrap-wrap is-justify-content-space-around ${theme}`}>
                <MetricCards metrics={metrics} />
            </div>
        </>
    )
};

export default Metrics;
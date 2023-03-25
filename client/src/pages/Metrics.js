import React from 'react';
import { useQuery } from '@apollo/client';
import { useTheme } from '../utils/ThemeContext';
import Auth from '../utils/auth';
import { Navigate } from 'react-router-dom';
import IssueType from '../components/IssueType';
import { GET_TICKETS_BY_USER_ID } from '../utils/queries';
import TimeInQueue from '../components/TimeInQueue';
import FeedbackScores from '../components/FeedbackScores';
import ResponseTime from '../components/ResponseTime';

function Metrics() {
    const { theme } = useTheme();

    const { loading, error, data, refetch } = useQuery(GET_TICKETS_BY_USER_ID,
        {
            variables: { userId: Auth.getUser()?.data._id }
        });

    if (!Auth.loggedIn()) {
        return (<Navigate to="/login" />)
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <>
            <h2 className={`${theme} is-block title has-text-centered`}> My Metrics</h2>
            <div className={`container is-flex  is-flex-wrap-wrap is-justify-content-space-around ${theme}`}>
                <IssueType metrics={data} />
                <ResponseTime metrics={data} />
                <TimeInQueue metrics={data} />
                <FeedbackScores metrics={data} />
            </div>
        </>
    )
};

export default Metrics;
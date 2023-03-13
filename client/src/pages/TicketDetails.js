import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_TICKET_BY_ID } from '../utils/queries';
import CommentList from '../components/CommentList';
import Auth from '../utils/auth';
import { useTheme } from '../utils/ThemeContext';

function TicketDetails() {
    const { theme } = useTheme();
    if (!Auth.loggedIn()) window.location.assign('/login');
    
    const { ticketId } = useParams();

    const { loading, error, data } = useQuery(GET_TICKET_BY_ID, {
        variables: { ticketId , userType: Auth.getUser().data.type }
    });

    if (Auth.getUser().data.type === 'Agent') {
        
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <div>
            <h2 className={`${theme} title has-text-centered`}>{data.getTicketById.title}</h2>
            <div className="block">
                <div className="columns is-multiline is-centered">
                    <div className="column">
                        <div className="message  has-text-centered is-half-tablet is-mobile">
                            <p className={`${theme}-primary message-body is-size-5`}>Status: <strong>{data.getTicketById.status}</strong></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="message has-text-centered is-half-tablet is-mobile">
                            <p className={`${theme}-secondary message-body is-size-5`}>Priority: <strong>{data.getTicketById.priority}</strong></p>
                        </div>
                    </div>
                </div>
                <div className={`${theme} message`}>
                    <div className={`message-header ${theme}-primary`}>
                        <p>Description</p>
                    </div>
                    <div className={`${theme}-primary-bg message-body`}>
                        <p className={`${theme}-primary-bg`}>{data.getTicketById.description}</p>
                    </div>
                </div>
            </div>
            {/* <div className="message has-text-centered">Comments</div> */}
            <div className="is-centered container comments-container">
                <CommentList comments={data.getTicketById.comments} />
            </div>
        </div>
    );
};

export default TicketDetails;
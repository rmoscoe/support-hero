import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_TICKET_BY_ID } from '../utils/queries';
import CommentList from '../components/CommentList';
import Auth from '../utils/auth';

function TicketDetails() {
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
            <h2 className="title has-text-centered">{data.getTicketById.title}</h2>
            <div className="block">
                <div className="columns is-multiline is-centered">
                    <div className="column">
                        <div className="message is-info has-text-centered is-half-tablet is-mobile">
                            <p className="message-body">Status: <strong>{data.getTicketById.status}</strong></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="message is-success has-text-centered is-half-tablet is-mobile">
                            <p className="message-body">Priority: <strong>{data.getTicketById.priority}</strong></p>
                        </div>
                    </div>
                </div>
                <div className="message is-info">
                    <div className="message-header">
                        <p>Description</p>
                    </div>
                    <div className="message-body">
                        <p>{data.getTicketById.description}</p>
                    </div>
                </div>
            </div>
            {/* <div className="message has-text-centered">Comments</div> */}
            <div className="is-centered container comments-container">
                <CommentList comments={data.getTicketById.comments} ticketStatus={data.getTicketById.status} />
            </div>
        </div>
    );
};

export default TicketDetails;
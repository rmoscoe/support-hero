import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_TICKET_BY_ID } from '../utils/queries';
import CommentsList from '../components/CommentsList';
import Auth from '../utils/auth';

function TicketDetails() {
    const { ticketId } = useParams();

    const { loading, error, data } = useQuery(GET_TICKET_BY_ID, {
        variables: { ticketId , userType: Auth.getUser().data.type }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <div>
            <h2 className="title has-text-centered">{data.getTicketById.title}</h2>
            <div className="block columns">
                <div className="message is-info column has-text-centered is-half-tablet is-full-mobile">
                    <p className="message-body">Status: <strong>{data.getTicketById.status}</strong></p>
                </div>
                <div className="message is-success column has-text-centered is-half-tablet is-full-mobile">
                    <p className="message-body">Priority: <strong>{data.getTicketById.priority}</strong></p>
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
            <div className="container comments-container">
                <CommentsList comments={data.getTicketById.comments} />
            </div>
        </div>
    );
}

export default TicketDetails;
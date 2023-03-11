import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_TICKET_BY_ID } from '../utils/queries';
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
            <h2>{data.getTicketById.title}</h2>
            <p>{data.getTicketById.description}</p>
            <p>Priority: {data.getTicketById.priority}</p>
            <p>Status: {data.getTicketById.status}</p>
            <div className="container comment-container">
                {/* <CommentList comments={data.comments} /> */}
            </div>
        </div>
    );
}

export default TicketDetails;
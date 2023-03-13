import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_TICKET_BY_ID } from '../utils/queries';
import { UPDATE_TICKET_STATUS } from '../utils/mutations';
import CommentList from '../components/CommentList';
import Auth from '../utils/auth';

function TicketDetails() {
    if (!Auth.loggedIn()) window.location.assign('/login');
    
    const { ticketId } = useParams();

    const { loading, error, data } = useQuery(GET_TICKET_BY_ID, {
        variables: { ticketId , userType: Auth.getUser().data.type }
    });

    const [updateTicket , {status}] = useMutation(UPDATE_TICKET_STATUS);

    if (Auth.getUser().data.type === 'Agent') {
        
    }

    const updateTicketStatus = () => {
        alert("in")
        updateTicket({
            variables: {
                ticketId : ticketId,
                status : "Closed"
            }
        })
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
                    <button className='button is-danger' onClick={updateTicketStatus}>Close Ticket</button>
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
                <CommentList comments={data.getTicketById.comments} />
            </div>
        </div>
    );
};

export default TicketDetails;
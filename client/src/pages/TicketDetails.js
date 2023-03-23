import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import { GET_TICKET_BY_ID } from '../utils/queries';
import { UPDATE_TICKET_STATUS } from '../utils/mutations';
import CommentList from '../components/CommentList';
import Auth from '../utils/auth';
import { useTheme } from '../utils/ThemeContext';
import SubmitFeedback from '../components/SubmitFeedback';
import TicketHistory from '../components/TicketHistory';



function TicketDetails() {
    const { theme } = useTheme();
    const [historyView, setHistoryView] = useState(false);

    const { ticketId } = useParams();

    const [isSubmitfeedback, setIsSubmitFeedback] = useState(false);


    const { loading, error, data, refetch } = useQuery(GET_TICKET_BY_ID, {
        variables: { ticketId, userType: Auth.getUser()?.data.type }
    });

    const [updateTicket] = useMutation(UPDATE_TICKET_STATUS);

    if (!Auth.loggedIn()) {
        return < Navigate to = "/login" />;
    };

    const userId = Auth.getUser()?.data?.id;

    const updateTicketStatus = () => {
        updateTicket({
            variables: {
                ticketId: ticketId,
                status: "Closed"
            }
        })
    }

    const handleSubmitFeedback = () => {
        setIsSubmitFeedback(true);
    }

    const handleCloseSubmitFeedback = () => {
        setIsSubmitFeedback(false);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    let customerId = data.getTicketById.users[0]._id;
    console.log(customerId)
    return (
        <div>
            <h2 className={`${theme} title has-text-centered`}>{data.getTicketById.title}</h2>
            <div className="block">
            {Auth.getUser().data.type === "Agent" && data.getTicketById.status !== "Closed" ? <button className={`${theme}-tertiary button close`} onClick={updateTicketStatus}>Close Ticket</button> : <label></label>}
            {Auth.getUser().data.type === "Agent" && <button className={`${theme}-tertiary button close`} onClick={() => setHistoryView(true)}>Customer History</button>}
            
            {historyView && <TicketHistory historyView={historyView} setHistoryView={setHistoryView} id={customerId}/>}
                <div className="columns is-multiline is-centered">
                    <div className="column">
                        <div className="message  has-text-centered is-half-tablet is-mobile">
                            <p className={`${theme}-secondary message-body is-size-5`}>Status: <strong>{data.getTicketById.status}</strong></p>
                        </div>
                    </div>
                    <div className="column">
                        <div className="message has-text-centered is-half-tablet is-mobile">
                            <p className={`${theme}-secondary message-body is-size-5`}>Priority: <strong>{data.getTicketById.priority}</strong></p>
                        </div>
                    </div>
                        {Auth.getUser().data.type === "Agent" &&
                            <div className="column">
                                <div className="message has-text-centered is-half-tablet is-mobile">
                                    <p className={`${theme}-secondary message-body is-size-5`}>Issue Type: <strong>{data.getTicketById.issueType}</strong></p>
                                </div>
                            </div>}
                        
                        {Auth.getUser().data.type === "Customer" && data.getTicketById.status === "Closed" && !data.getTicketById.feedback ? <button  className={`${theme}-tertiary button`} onClick={handleSubmitFeedback} data-target="submit-feedback-form">Submit Feedback</button> : <label></label>}
                </div>
                <div className={`${theme} message`}>
                    <div className={`message-header ${theme}-primary`}>
                        <p>Description</p>
                    </div>
                    <div className={`${theme}-primary-bg message-body`}>
                        <p>{data.getTicketById.description}</p>
                    </div>
                </div>
            </div>
            <div className="is-centered container comments-container">
                <CommentList comments={data.getTicketById.comments} status={data.getTicketById.status} userId={userId} refetchTicket={refetch} />
            </div>
            {<SubmitFeedback isActive={isSubmitfeedback} handleSubmitFeedback={handleCloseSubmitFeedback} refetchTicketData={refetch} />}
        </div>
    );
};

export default TicketDetails;
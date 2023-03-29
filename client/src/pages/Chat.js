import Auth from '../utils/auth';
import { useQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import { GET_CHATROOM_BY_TICKET_ID } from '../utils/queries';
import ChatHeader from '../components/ChatHeader';
import ChatMessageList from '../components/ChatMessageList';
import ChatForm from '../components/ChatForm';

function Chat() {
    const userId = Auth.getUser().data._id;
    const { ticketId } = useParams();

    const { loading, error, data } = useQuery(GET_CHATROOM_BY_TICKET_ID,
        {
            variables: { ticketId }
        });


    if (!Auth.loggedIn()) {
        return < Navigate to="/login" />;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log(userId);

    return (
        <div className="chat columns is-centered">
            <div className="column is-4">
                <ChatHeader roomName={data.getChatRoomByTicketId.roomName} />
                <ChatMessageList messages={data.getChatRoomByTicketId.messages}/>
                <ChatForm roomId={data.getChatRoomByTicketId._id} userId={userId}/>
            </div>
        </div>
    );
};

export default Chat;
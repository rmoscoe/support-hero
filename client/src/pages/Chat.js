import Auth from '../utils/auth';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useTheme } from '../utils/ThemeContext';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { GET_CHATROOM_BY_TICKET_ID } from '../utils/queries';
import { io } from 'socket.io-client';
import ChatHeader from '../components/ChatHeader';
import ChatMessageList from '../components/ChatMessageList';
import ChatForm from '../components/ChatForm';

function Chat() {
    const userId = Auth.getUser().data._id;
    const { theme } = useTheme();
    const { ticketId } = useParams();
    // const socket = io();

    const { loading, error, data , refetch } = useQuery(GET_CHATROOM_BY_TICKET_ID,
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
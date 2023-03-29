import Auth from '../utils/auth';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import { GET_CHATROOM_BY_TICKET_ID } from '../utils/queries';
import { CREATE_CHAT_MESSAGE } from '../utils/mutations';
// import io from 'socket.io-client';
import ChatHeader from '../components/ChatHeader';
import ChatMessageList from '../components/ChatMessageList';
import ChatForm from '../components/ChatForm';
// import { useTheme } from '../utils/ThemeContext';

function Chat() {
    const userId = Auth.getUser().data._id;
    const { ticketId } = useParams();
    // const { theme } = useTheme();
    // const [socket, setSocket] = useState(null);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const { loading, error, data } = useQuery(GET_CHATROOM_BY_TICKET_ID,
    {
            variables: { ticketId }
    });

    // const roomId= data.getChatRoomByTicketId._id;

    const [createChatMessage] = useMutation(CREATE_CHAT_MESSAGE);

    const chatFormRef = useRef(null);

    const scrollToBottom = () => {
        chatFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [data]);

    useEffect(() => {
        if (data) {
            setMessages(data.getChatRoomByTicketId.messages);
        }
    }, [data]);
    // useEffect(() => {
    //     const newSocket = io('http://localhost:3002');
    //     setSocket(newSocket);

    //     return () => newSocket.close();
    // }, []);

    // useEffect(() => {
    //     if (socket) {
    //         socket.emit('joinRoom', ticketId);

    //         socket.on('message', () => {
    //             subscribeToMore({
    //                 document: GET_CHATROOM_BY_TICKET_ID,
    //                 variables: { ticketId },
    //                 updateQuery: (prev, { chatRoomData }) => {
    //                     if (!chatRoomData.data) return prev;
    //                     const newMessage = chatRoomData.data.messageCreated;
    //                     return Object.assign({}, prev, {
    //                         messages: [...prev.messages, newMessage]
    //                     });
    //                 }
    //             });
    //         });
    //     }
    // }, [socket, ticketId, subscribeToMore]);

    const sendMessage = async (messageToSend) => {
        if (messageToSend.trim !== '') {
            const { data: newMessageData } = await createChatMessage({ variables: { roomId: data.getChatRoomByTicketId._id, userId, message: messageToSend }});
            const newMessage = newMessageData.createChatMessage;
            setMessages([...messages, newMessage]);
            setMessage('');
            // socket.emit('sendMessage', { roomId: data.getChatRoomByTicketId._id, userId, message });
            // refetch();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        setMessage(formData.get("message"));
        if (formData.get("message")) {
            sendMessage(formData.get("message"));
        }
        event.target.reset();
    };

    if (!Auth.loggedIn()) {
        return < Navigate to="/login" />;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="body chat">
            <div>
                <ChatHeader roomName={data.getChatRoomByTicketId.roomName} />
                <ChatMessageList messages={messages} id={userId}/>
                <ChatForm handleSubmit={handleSubmit} setMessage={setMessage} roomId={data.getChatRoomByTicketId._id} userId={userId} ref={chatFormRef}/>
            </div>
        </div>
    );
};

export default Chat;
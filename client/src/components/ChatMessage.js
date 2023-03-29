import React from 'react';
import { useTheme } from '../utils/ThemeContext';

function ChatMessage({ message }) {
    
    return (
        <div className="chat-message">
            <div>{message.message}</div>
            <div>{message.userId.firstName}</div>
            <div>{message.createdAt}</div>
        </div>
    );
};

export default ChatMessage;